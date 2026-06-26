import fs from 'node:fs';

const commentMarker = '<!-- dongchimi-performance-report -->';
const manifestPath = 'lighthouse-report/manifest.json';
const assertionPath = '.lighthouseci/assertion-results.json';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

const roundMetric = (value) => {
  if (typeof value !== 'number') {
    return '-';
  }

  return String(Math.round(value));
};

const formatScore = (score) => {
  if (typeof score !== 'number') {
    return '-';
  }

  return String(Math.round(score * 100));
};

const formatBytes = (value) => {
  if (typeof value !== 'number') {
    return '-';
  }

  return `${Math.round(value / 1024)}KB`;
};

const getPrNumber = () => {
  if (process.env.PERFORMANCE_COMMENT_PR_NUMBER) {
    return Number(process.env.PERFORMANCE_COMMENT_PR_NUMBER);
  }

  if (!process.env.GITHUB_EVENT_PATH || !fs.existsSync(process.env.GITHUB_EVENT_PATH)) {
    return null;
  }

  const eventPayload = readJson(process.env.GITHUB_EVENT_PATH);
  return eventPayload.pull_request?.number ?? null;
};

const getReportRows = () => {
  const manifest = readJson(manifestPath).filter((entry) => entry.isRepresentativeRun);

  return manifest.map((entry) => {
    const report = readJson(entry.jsonPath);
    const audits = report.audits;
    const resources = new Map(
      audits['resource-summary'].details.items.map((item) => [item.resourceType, item]),
    );

    return {
      url: report.finalDisplayedUrl ?? report.finalUrl ?? entry.url,
      performance: formatScore(report.categories.performance?.score),
      accessibility: formatScore(report.categories.accessibility?.score),
      bestPractices: formatScore(report.categories['best-practices']?.score),
      seo: formatScore(report.categories.seo?.score),
      fcp: roundMetric(audits['first-contentful-paint']?.numericValue),
      lcp: roundMetric(audits['largest-contentful-paint']?.numericValue),
      cls:
        typeof audits['cumulative-layout-shift']?.numericValue === 'number'
          ? audits['cumulative-layout-shift'].numericValue.toFixed(3)
          : '-',
      tbt: roundMetric(audits['total-blocking-time']?.numericValue),
      script: formatBytes(resources.get('script')?.transferSize),
      image: formatBytes(resources.get('image')?.transferSize),
    };
  });
};

const getAssertionSummary = () => {
  if (!fs.existsSync(assertionPath)) {
    return {
      total: 0,
      failed: 0,
    };
  }

  const assertions = readJson(assertionPath);

  return {
    total: assertions.length,
    failed: assertions.filter((assertion) => !assertion.passed).length,
  };
};

const createCommentBody = () => {
  const rows = getReportRows();
  const assertionSummary = getAssertionSummary();
  const runUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null;

  const tableRows = rows
    .map(
      (row) =>
        `| \`${row.url}\` | ${row.performance} | ${row.accessibility} | ${row.bestPractices} | ${row.seo} | ${row.fcp}ms | ${row.lcp}ms | ${row.cls} | ${row.tbt}ms | ${row.script} | ${row.image} |`,
    )
    .join('\n');

  const assertionText =
    assertionSummary.failed === 0
      ? `전체 ${assertionSummary.total}개 assertion이 통과했습니다.`
      : `${assertionSummary.failed}/${assertionSummary.total}개 assertion이 warning 기준을 넘었습니다.`;

  return `${commentMarker}
## Lighthouse Performance Report

측정이 완료되어 Lighthouse 요약을 남깁니다.

| URL | Perf | A11y | Best | SEO | FCP | LCP | CLS | TBT | Script | Image |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${tableRows}

- 기준: \`lighthouserc.cjs\`
- 결과: ${assertionText}
- Artifact: \`lighthouse-report\`, \`.lighthouseci\`
${runUrl ? `- Workflow: [GitHub Actions run](${runUrl})` : ''}
`;
};

const requestGitHub = async ({ method, url, body }) => {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API request failed: ${response.status} ${text}`);
  }

  return response.json();
};

const main = async () => {
  const prNumber = getPrNumber();
  const repository = process.env.GITHUB_REPOSITORY;

  if (!prNumber || !repository) {
    console.log('Performance comment skipped: pull request context was not found.');
    return;
  }

  const commentBody = createCommentBody();

  if (process.env.PERFORMANCE_COMMENT_DRY_RUN === 'true') {
    console.log(commentBody);
    return;
  }

  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required to write a performance comment.');
  }

  const apiBaseUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const commentsUrl = `${apiBaseUrl}/repos/${repository}/issues/${prNumber}/comments`;
  const comments = await requestGitHub({ method: 'GET', url: commentsUrl });
  const existingComment = comments.find((comment) => comment.body?.includes(commentMarker));

  if (existingComment) {
    await requestGitHub({
      method: 'PATCH',
      url: existingComment.url,
      body: { body: commentBody },
    });
    console.log(`Updated Lighthouse summary comment on PR #${prNumber}.`);
    return;
  }

  await requestGitHub({
    method: 'POST',
    url: commentsUrl,
    body: { body: commentBody },
  });
  console.log(`Created Lighthouse summary comment on PR #${prNumber}.`);
};

await main();
