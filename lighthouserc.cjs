const appUrls = ['http://127.0.0.1:3000/', 'http://127.0.0.1:5173/'];

module.exports = {
  ci: {
    collect: {
      url: appUrls,
      startServerCommand: 'node scripts/performance/serve-apps.mjs',
      startServerReadyPattern: 'LHCI servers ready',
      startServerReadyTimeout: 120000,
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--disable-gpu --no-sandbox',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 1200000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 250000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }],
        'resource-summary:font:count': ['warn', { maxNumericValue: 4 }],
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 5 }],
      },
      includePassedAssertions: true,
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-report',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
