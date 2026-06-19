import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type { PlopTypes } from '@turbo/gen';

type ComponentCategoryTypes = 'layout' | 'ui';
type AppNameTypes = 'client';

interface DesignSystemComponentAnswers {
  category: ComponentCategoryTypes;
  componentFolder: string;
  componentName: string;
}

interface AppComponentAnswers extends DesignSystemComponentAnswers {
  app: AppNameTypes;
}

interface ReactPageAnswers {
  app: AppNameTypes;
  domain: string;
  page: string;
  pageName: string;
}

interface NextPageAnswers extends ReactPageAnswers {
  routePath: string;
}

interface DomainComponentAnswers {
  app: AppNameTypes;
  componentFolder: string;
  componentName: string;
  domain: string;
  page: string;
}

interface DomainSectionAnswers {
  app: AppNameTypes;
  domain: string;
  page: string;
  sectionFolder: string;
  sectionName: string;
}

interface DomainQueryAnswers {
  app: AppNameTypes;
  domain: string;
  queryName: string;
}

interface DomainMutationAnswers {
  app: AppNameTypes;
  domain: string;
  mutationName: string;
}

interface QueryKeyFactoryParams {
  domain: string;
  exportName: string;
  filePath: string;
  importLine: string;
  queryName: string;
}

const toKebabCase = (value: string) => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

const toCamelCase = (value: string) => {
  return toKebabCase(value).replace(/-([a-z0-9])/g, (_, character: string) => {
    return character.toUpperCase();
  });
};

const toTitleCase = (value: string) => {
  if (value === 'ui') {
    return 'UI';
  }

  return value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const isPascalCase = (value: string) => {
  return /^[A-Z][A-Za-z0-9]*$/.test(value);
};

const isKebabCase = (value: string) => {
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
};

const isAppName = (value: string): value is AppNameTypes => {
  return value === 'client';
};

const isValidNextRoutePath = (value: string) => {
  const segments = value.split('/').filter(Boolean);

  return (
    segments.length > 0 &&
    !value.includes('//') &&
    segments.every((segment) => segment !== '.' && segment !== '..') &&
    /^[a-z0-9()[\]._-]+(?:\/[a-z0-9()[\]._-]+)*$/.test(value)
  );
};

const getRequiredString = (value: unknown, fieldName: string) => {
  const nextValue = String(value ?? '').trim();

  if (nextValue.length === 0) {
    throw new Error(`Provide ${fieldName}.`);
  }

  return nextValue;
};

const getRequiredAppName = (value: unknown) => {
  const app = String(value ?? '').trim();

  if (!isAppName(app)) {
    throw new Error('Provide app as client. Extend the generator after the app exists.');
  }

  return app;
};

const getComponentName = (value: unknown) => {
  const componentName = getRequiredString(value, 'componentName');

  if (!isPascalCase(componentName)) {
    throw new Error('Use PascalCase for componentName. Example: UserProfileCard');
  }

  return componentName;
};

const getComponentCategory = (value: unknown) => {
  const category = String(value ?? 'ui');

  if (category !== 'ui' && category !== 'layout') {
    throw new Error('Use ui or layout for category.');
  }

  return category;
};

const getComponentFolder = (value: unknown, componentName: string) => {
  const componentFolder = String(value ?? toKebabCase(componentName));

  if (!isKebabCase(componentFolder)) {
    throw new Error('Use kebab-case for componentFolder. Example: user-profile-card');
  }

  return componentFolder;
};

const getDomainName = (value: unknown) => {
  const domain = getRequiredString(value, 'domain');

  if (!isKebabCase(domain)) {
    throw new Error('Use kebab-case for domain. Example: member-management');
  }

  return domain;
};

const getPageFolder = (value: unknown) => {
  const page = getRequiredString(value, 'page');

  if (!isKebabCase(page)) {
    throw new Error('Use kebab-case for page. Example: list');
  }

  return page;
};

const getPageName = (value: unknown) => {
  const pageName = getRequiredString(value, 'pageName');

  if (!isPascalCase(pageName) || !pageName.endsWith('Page')) {
    throw new Error('Use PascalCase ending with Page for pageName. Example: ReservationListPage');
  }

  return pageName;
};

const getRoutePath = (value: unknown) => {
  const routePath = getRequiredString(value, 'routePath').replace(/^\/+|\/+$/g, '');

  if (!isValidNextRoutePath(routePath)) {
    throw new Error('Use a Next route path without leading slash. Example: reservation/[id]');
  }

  return routePath;
};

const getSectionName = (value: unknown) => {
  const sectionName = getRequiredString(value, 'sectionName');

  if (!isPascalCase(sectionName)) {
    throw new Error('Use PascalCase for sectionName. Example: ReservationListSection');
  }

  return sectionName;
};

const getQueryName = (value: unknown) => {
  const queryName = getRequiredString(value, 'queryName');

  if (!isPascalCase(queryName)) {
    throw new Error('Use PascalCase for queryName. Example: ReservationList');
  }

  return queryName;
};

const getMutationName = (value: unknown) => {
  const mutationName = getRequiredString(value, 'mutationName');

  if (!isPascalCase(mutationName)) {
    throw new Error('Use PascalCase for mutationName. Example: UpdateReservation');
  }

  return mutationName;
};

const getDesignSystemComponentAnswers = (
  answers: PlopTypes.Answers | undefined,
): DesignSystemComponentAnswers => {
  const componentName = getComponentName(answers?.componentName);

  return {
    category: getComponentCategory(answers?.category),
    componentFolder: getComponentFolder(answers?.componentFolder, componentName),
    componentName,
  };
};

const getAppComponentAnswers = (answers: PlopTypes.Answers | undefined): AppComponentAnswers => {
  const componentName = getComponentName(answers?.componentName);

  return {
    app: getRequiredAppName(answers?.app),
    category: getComponentCategory(answers?.category),
    componentFolder: getComponentFolder(answers?.componentFolder, componentName),
    componentName,
  };
};

const getReactPageAnswers = (answers: PlopTypes.Answers | undefined): ReactPageAnswers => {
  return {
    app: getRequiredAppName(answers?.app),
    domain: getDomainName(answers?.domain),
    page: getPageFolder(answers?.page),
    pageName: getPageName(answers?.pageName),
  };
};

const getNextPageAnswers = (answers: PlopTypes.Answers | undefined): NextPageAnswers => {
  return {
    ...getReactPageAnswers(answers),
    routePath: getRoutePath(answers?.routePath),
  };
};

const getDomainComponentAnswers = (
  answers: PlopTypes.Answers | undefined,
): DomainComponentAnswers => {
  const componentName = getComponentName(answers?.componentName);

  return {
    app: getRequiredAppName(answers?.app),
    componentFolder: getComponentFolder(answers?.componentFolder, componentName),
    componentName,
    domain: getDomainName(answers?.domain),
    page: getPageFolder(answers?.page),
  };
};

const getDomainSectionAnswers = (answers: PlopTypes.Answers | undefined): DomainSectionAnswers => {
  const sectionName = getSectionName(answers?.sectionName);

  return {
    app: getRequiredAppName(answers?.app),
    domain: getDomainName(answers?.domain),
    page: getPageFolder(answers?.page),
    sectionFolder: getComponentFolder(answers?.sectionFolder, sectionName),
    sectionName,
  };
};

const getDomainQueryAnswers = (answers: PlopTypes.Answers | undefined): DomainQueryAnswers => {
  return {
    app: getRequiredAppName(answers?.app),
    domain: getDomainName(answers?.domain),
    queryName: getQueryName(answers?.queryName),
  };
};

const getDomainMutationAnswers = (
  answers: PlopTypes.Answers | undefined,
): DomainMutationAnswers => {
  return {
    app: getRequiredAppName(answers?.app),
    domain: getDomainName(answers?.domain),
    mutationName: getMutationName(answers?.mutationName),
  };
};

const appendUniqueLines = (filePath: string, lines: string[]) => {
  const existingContent = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  const existingLines = new Set(existingContent.split('\n'));
  const linesToAppend = lines.filter((line) => line.length > 0 && !existingLines.has(line));

  if (linesToAppend.length === 0) {
    return;
  }

  mkdirSync(dirname(filePath), { recursive: true });

  const contentWithoutEmptyExport = existingContent.replace(/^export \{\};\n?/m, '').trimEnd();
  const nextContent = [contentWithoutEmptyExport, ...linesToAppend].filter(Boolean).join('\n');

  writeFileSync(filePath, `${nextContent}\n`);
};

const ensureGitkeepDirectory = (directoryPath: string) => {
  mkdirSync(directoryPath, { recursive: true });

  const gitkeepPath = `${directoryPath}/.gitkeep`;

  if (!existsSync(gitkeepPath)) {
    writeFileSync(gitkeepPath, '');
  }
};

const ensureQueryKeysFile = (filePath: string) => {
  if (existsSync(filePath)) {
    return;
  }

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(
    filePath,
    [
      '// Domain query key factories live here.',
      '// Include every parameter that changes the response in the query key.',
      '',
    ].join('\n'),
  );
};

const insertImportLine = (content: string, importLine: string) => {
  if (content.includes(importLine)) {
    return content;
  }

  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index]?.startsWith('import ')) {
      lastImportIndex = index;
      break;
    }
  }

  if (lastImportIndex === -1) {
    return [importLine, '', content.trimStart()].join('\n');
  }

  lines.splice(lastImportIndex + 1, 0, importLine);
  return lines.join('\n');
};

const appendQueryKeyFactory = ({
  domain,
  exportName,
  filePath,
  importLine,
  queryName,
}: QueryKeyFactoryParams) => {
  const existingContent = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';

  if (existingContent.includes(`export const ${exportName}`)) {
    return `Skipped ${exportName}; query key factory already exists.`;
  }

  const nextContentWithImport = insertImportLine(existingContent.trimEnd(), importLine).trimEnd();
  const queryKeyBlock = [
    `export const ${exportName} = {`,
    `  all: ['${domain}', '${toKebabCase(queryName)}'] as const,`,
    `  query: (params: ${queryName}Params) => [...${exportName}.all, params] as const,`,
    '};',
  ].join('\n');
  const nextContent = [nextContentWithImport, queryKeyBlock].filter(Boolean).join('\n\n');

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${nextContent}\n`);

  return `Updated ${filePath} with ${exportName}.`;
};

const getDomainRoot = (app: AppNameTypes, domain: string) => {
  return `apps/${app}/src/domains/${domain}`;
};

const getReactPageData = ({ app, domain, page, pageName }: ReactPageAnswers) => {
  const domainRoot = getDomainRoot(app, domain);

  return {
    app,
    domain,
    domainRoot,
    page,
    pageName,
    pageRoot: `${domainRoot}/${page}`,
  };
};

const getNextRouteDepth = (routePath: string) => {
  return routePath.split('/').filter(Boolean).length;
};

const getDomainImportPath = ({
  domain,
  page,
  pageName,
  routePath,
}: {
  domain: string;
  page: string;
  pageName: string;
  routePath: string;
}) => {
  const routeToSrcPrefix = '../'.repeat(getNextRouteDepth(routePath) + 1);

  return `${routeToSrcPrefix}domains/${domain}/${page}/${pageName}`;
};

const getNextPageData = ({ routePath, ...answers }: NextPageAnswers) => {
  const reactPageData = getReactPageData(answers);

  return {
    ...reactPageData,
    routePath,
    routeRoot: `apps/${answers.app}/src/app/${routePath}`,
    domainImportPath: getDomainImportPath({
      domain: answers.domain,
      page: answers.page,
      pageName: answers.pageName,
      routePath,
    }),
  };
};

const getDomainQueryData = ({ app, domain, queryName }: DomainQueryAnswers) => {
  const domainRoot = getDomainRoot(app, domain);
  const queryKebabName = toKebabCase(queryName);

  return {
    app,
    domain,
    domainRoot,
    queryCamelName: toCamelCase(queryName),
    queryKeyName: `${toCamelCase(queryName)}QueryKeys`,
    queryKebabName,
    queryName,
  };
};

const getDomainMutationData = ({ app, domain, mutationName }: DomainMutationAnswers) => {
  const domainRoot = getDomainRoot(app, domain);
  const mutationKebabName = toKebabCase(mutationName);

  return {
    app,
    domain,
    domainRoot,
    mutationCamelName: toCamelCase(mutationName),
    mutationKebabName,
    mutationName,
  };
};

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setHelper('titleCase', (value: string) => {
    return toTitleCase(value);
  });

  plop.setGenerator('ds-component', {
    description: 'Create a design-system component scaffold.',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name (PascalCase)',
        validate: (value) => isPascalCase(value) || 'Use PascalCase. Example: Button',
      },
      {
        type: 'list',
        name: 'category',
        message: 'Component category',
        choices: ['ui', 'layout'],
        default: 'ui',
      },
      {
        type: 'input',
        name: 'componentFolder',
        message: 'Component folder path (kebab-case)',
        default: (answers: Partial<DesignSystemComponentAnswers>) => {
          return toKebabCase(answers.componentName ?? 'component');
        },
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: icon-button',
      },
    ],
    actions: (answers) => {
      const { category, componentFolder, componentName } = getDesignSystemComponentAnswers(answers);
      const componentRoot = `packages/design-system/src/components/${category}/${componentFolder}`;

      return [
        {
          type: 'add',
          path: `${componentRoot}/${componentName}.tsx`,
          templateFile: 'templates/ds-component/Component.tsx.hbs',
          data: { componentName },
        },
        {
          type: 'add',
          path: `${componentRoot}/${componentName}.spec.md`,
          templateFile: 'templates/ds-component/Component.spec.md.hbs',
          data: { category, componentFolder, componentName },
        },
        {
          type: 'add',
          path: `${componentRoot}/${componentName}.stories.tsx`,
          templateFile: 'templates/ds-component/Component.stories.tsx.hbs',
          data: { category, componentName },
        },
        {
          type: 'add',
          path: `${componentRoot}/index.ts`,
          templateFile: 'templates/ds-component/index.ts.hbs',
          data: { componentName },
        },
        () => {
          const categoryExportLines = [
            `export { ${componentName} } from './${componentFolder}';`,
            `export type { ${componentName}Props } from './${componentFolder}';`,
          ];
          const componentsExportLines = [
            `export { ${componentName} } from './${category}/${componentFolder}';`,
            `export type { ${componentName}Props } from './${category}/${componentFolder}';`,
          ];
          const packageExportLines = [
            `export { ${componentName} } from './components/${category}/${componentFolder}';`,
            `export type { ${componentName}Props } from './components/${category}/${componentFolder}';`,
          ];

          appendUniqueLines(
            `packages/design-system/src/components/${category}/index.ts`,
            categoryExportLines,
          );
          appendUniqueLines(
            'packages/design-system/src/components/index.ts',
            componentsExportLines,
          );
          appendUniqueLines('packages/design-system/src/index.ts', packageExportLines);

          return `Updated explicit exports for ${componentName}.`;
        },
      ];
    },
  });

  plop.setGenerator('app-component', {
    description: 'Create an app-shared component scaffold.',
    prompts: [
      {
        type: 'list',
        name: 'app',
        message: 'Target app',
        choices: ['client'],
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name (PascalCase)',
        validate: (value) => isPascalCase(value) || 'Use PascalCase. Example: UserProfileCard',
      },
      {
        type: 'list',
        name: 'category',
        message: 'Component category',
        choices: ['ui', 'layout'],
        default: 'ui',
      },
      {
        type: 'input',
        name: 'componentFolder',
        message: 'Component folder path (kebab-case)',
        default: (answers: Partial<AppComponentAnswers>) => {
          return toKebabCase(answers.componentName ?? 'component');
        },
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: user-profile-card',
      },
    ],
    actions: (answers) => {
      const { app, category, componentFolder, componentName } = getAppComponentAnswers(answers);
      const componentRoot = `apps/${app}/src/shared/components/${category}/${componentFolder}`;

      return [
        {
          type: 'add',
          path: `${componentRoot}/${componentName}.tsx`,
          templateFile: 'templates/app-component/Component.tsx.hbs',
          data: { componentName },
        },
        {
          type: 'add',
          path: `${componentRoot}/${componentName}.spec.md`,
          templateFile: 'templates/app-component/Component.spec.md.hbs',
          data: { app, category, componentFolder, componentName },
        },
        {
          type: 'add',
          path: `${componentRoot}/index.ts`,
          templateFile: 'templates/app-component/index.ts.hbs',
          data: { componentName },
        },
        () => {
          const categoryExportLines = [
            `export { ${componentName} } from './${componentFolder}';`,
            `export type { ${componentName}Props } from './${componentFolder}';`,
          ];
          const componentsExportLines = [
            `export { ${componentName} } from './${category}/${componentFolder}';`,
            `export type { ${componentName}Props } from './${category}/${componentFolder}';`,
          ];

          appendUniqueLines(
            `apps/${app}/src/shared/components/${category}/index.ts`,
            categoryExportLines,
          );
          appendUniqueLines(`apps/${app}/src/shared/components/index.ts`, componentsExportLines);

          return `Updated ${app} app-shared exports for ${componentName}.`;
        },
      ];
    },
  });

  plop.setGenerator('next-page', {
    description: 'Create a Next.js App Router route and domain page scaffold.',
    prompts: [
      {
        type: 'list',
        name: 'app',
        message: 'Target app',
        choices: ['client'],
      },
      {
        type: 'input',
        name: 'routePath',
        message: 'Next route path without leading slash',
        filter: (value) => String(value ?? '').replace(/^\/+|\/+$/g, ''),
        validate: (value) => {
          const routePath = String(value ?? '').replace(/^\/+|\/+$/g, '');

          return (
            isValidNextRoutePath(routePath) ||
            'Use a Next route path without leading slash. Example: reservation/[id]'
          );
        },
      },
      {
        type: 'input',
        name: 'domain',
        message: 'Domain folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: reservation',
      },
      {
        type: 'input',
        name: 'page',
        message: 'Page folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: list',
      },
      {
        type: 'input',
        name: 'pageName',
        message: 'Page component name (PascalCase ending with Page)',
        validate: (value) => {
          return (
            (isPascalCase(value) && String(value).endsWith('Page')) ||
            'Use PascalCase ending with Page. Example: ReservationListPage'
          );
        },
      },
    ],
    actions: (answers) => {
      const data = getNextPageData(getNextPageAnswers(answers));

      return [
        {
          type: 'add',
          path: `${data.pageRoot}/${data.pageName}.tsx`,
          templateFile: 'templates/react-page/Page.tsx.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.pageRoot}/${data.pageName}.spec.md`,
          templateFile: 'templates/react-page/Page.spec.md.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.routeRoot}/page.tsx`,
          templateFile: 'templates/next-page/page.tsx.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.routeRoot}/page.spec.md`,
          templateFile: 'templates/next-page/page.spec.md.hbs',
          data,
        },
        () => {
          ensureGitkeepDirectory(`${data.domainRoot}/api`);
          ensureGitkeepDirectory(`${data.domainRoot}/hooks`);
          ensureGitkeepDirectory(`${data.domainRoot}/model`);
          ensureQueryKeysFile(`${data.domainRoot}/query-keys.ts`);
          ensureGitkeepDirectory(`${data.pageRoot}/components`);
          ensureGitkeepDirectory(`${data.pageRoot}/sections`);
          ensureGitkeepDirectory(`${data.pageRoot}/utils`);

          return `Prepared ${data.app} Next route ${data.routePath} and ${data.domain}/${data.page} domain scaffold.`;
        },
      ];
    },
  });

  plop.setGenerator('react-page', {
    description: 'Create a router-agnostic React domain page scaffold.',
    prompts: [
      {
        type: 'list',
        name: 'app',
        message: 'Target app',
        choices: ['client'],
      },
      {
        type: 'input',
        name: 'domain',
        message: 'Domain folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: reservation',
      },
      {
        type: 'input',
        name: 'page',
        message: 'Page folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: list',
      },
      {
        type: 'input',
        name: 'pageName',
        message: 'Page component name (PascalCase ending with Page)',
        validate: (value) => {
          return (
            (isPascalCase(value) && String(value).endsWith('Page')) ||
            'Use PascalCase ending with Page. Example: ReservationListPage'
          );
        },
      },
    ],
    actions: (answers) => {
      const data = getReactPageData(getReactPageAnswers(answers));

      return [
        {
          type: 'add',
          path: `${data.pageRoot}/${data.pageName}.tsx`,
          templateFile: 'templates/react-page/Page.tsx.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.pageRoot}/${data.pageName}.spec.md`,
          templateFile: 'templates/react-page/Page.spec.md.hbs',
          data,
        },
        () => {
          ensureGitkeepDirectory(`${data.domainRoot}/api`);
          ensureGitkeepDirectory(`${data.domainRoot}/hooks`);
          ensureGitkeepDirectory(`${data.domainRoot}/model`);
          ensureQueryKeysFile(`${data.domainRoot}/query-keys.ts`);
          ensureGitkeepDirectory(`${data.pageRoot}/components`);
          ensureGitkeepDirectory(`${data.pageRoot}/sections`);
          ensureGitkeepDirectory(`${data.pageRoot}/utils`);

          return `Prepared ${data.app} ${data.domain}/${data.page} React domain page scaffold.`;
        },
      ];
    },
  });

  plop.setGenerator('domain-component', {
    description: 'Create a page-local domain component scaffold.',
    prompts: [
      {
        type: 'list',
        name: 'app',
        message: 'Target app',
        choices: ['client'],
      },
      {
        type: 'input',
        name: 'domain',
        message: 'Domain folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: reservation',
      },
      {
        type: 'input',
        name: 'page',
        message: 'Page folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: list',
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name (PascalCase)',
        validate: (value) => isPascalCase(value) || 'Use PascalCase. Example: ReservationCard',
      },
      {
        type: 'input',
        name: 'componentFolder',
        message: 'Component folder path (kebab-case)',
        default: (answers: Partial<DomainComponentAnswers>) => {
          return toKebabCase(answers.componentName ?? 'component');
        },
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: reservation-card',
      },
    ],
    actions: (answers) => {
      const { app, componentFolder, componentName, domain, page } =
        getDomainComponentAnswers(answers);
      const componentRoot = `${getDomainRoot(app, domain)}/${page}/components/${componentFolder}`;
      const data = { app, componentFolder, componentName, domain, page };

      return [
        {
          type: 'add',
          path: `${componentRoot}/${componentName}.tsx`,
          templateFile: 'templates/domain-component/Component.tsx.hbs',
          data,
        },
        {
          type: 'add',
          path: `${componentRoot}/${componentName}.spec.md`,
          templateFile: 'templates/domain-component/Component.spec.md.hbs',
          data,
        },
        {
          type: 'add',
          path: `${componentRoot}/index.ts`,
          templateFile: 'templates/domain-component/index.ts.hbs',
          data,
        },
      ];
    },
  });

  plop.setGenerator('domain-section', {
    description: 'Create a page-local domain section scaffold.',
    prompts: [
      {
        type: 'list',
        name: 'app',
        message: 'Target app',
        choices: ['client'],
      },
      {
        type: 'input',
        name: 'domain',
        message: 'Domain folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: reservation',
      },
      {
        type: 'input',
        name: 'page',
        message: 'Page folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: list',
      },
      {
        type: 'input',
        name: 'sectionName',
        message: 'Section name (PascalCase)',
        validate: (value) => {
          return isPascalCase(value) || 'Use PascalCase. Example: ReservationListSection';
        },
      },
      {
        type: 'input',
        name: 'sectionFolder',
        message: 'Section folder path (kebab-case)',
        default: (answers: Partial<DomainSectionAnswers>) => {
          return toKebabCase(answers.sectionName ?? 'section');
        },
        filter: (value) => toKebabCase(value),
        validate: (value) => {
          return isKebabCase(value) || 'Use kebab-case. Example: reservation-list-section';
        },
      },
    ],
    actions: (answers) => {
      const { app, domain, page, sectionFolder, sectionName } = getDomainSectionAnswers(answers);
      const sectionRoot = `${getDomainRoot(app, domain)}/${page}/sections/${sectionFolder}`;
      const data = { app, domain, page, sectionFolder, sectionName };

      return [
        {
          type: 'add',
          path: `${sectionRoot}/${sectionName}.tsx`,
          templateFile: 'templates/domain-section/Section.tsx.hbs',
          data,
        },
        {
          type: 'add',
          path: `${sectionRoot}/${sectionName}.spec.md`,
          templateFile: 'templates/domain-section/Section.spec.md.hbs',
          data,
        },
        {
          type: 'add',
          path: `${sectionRoot}/index.ts`,
          templateFile: 'templates/domain-section/index.ts.hbs',
          data,
        },
      ];
    },
  });

  plop.setGenerator('domain-query', {
    description: 'Create a domain-level API query scaffold.',
    prompts: [
      {
        type: 'list',
        name: 'app',
        message: 'Target app',
        choices: ['client'],
      },
      {
        type: 'input',
        name: 'domain',
        message: 'Domain folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: reservation',
      },
      {
        type: 'input',
        name: 'queryName',
        message: 'Query name (PascalCase)',
        validate: (value) => isPascalCase(value) || 'Use PascalCase. Example: ReservationList',
      },
    ],
    actions: (answers) => {
      const data = getDomainQueryData(getDomainQueryAnswers(answers));

      return [
        {
          type: 'add',
          path: `${data.domainRoot}/api/${data.queryKebabName}-api.ts`,
          templateFile: 'templates/domain-query/query-api.ts.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.domainRoot}/hooks/use-${data.queryKebabName}-query.ts`,
          templateFile: 'templates/domain-query/use-query.ts.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.domainRoot}/hooks/use-${data.queryKebabName}-query.spec.md`,
          templateFile: 'templates/domain-query/use-query.spec.md.hbs',
          data,
        },
        () => {
          ensureGitkeepDirectory(`${data.domainRoot}/model`);

          return appendQueryKeyFactory({
            domain: data.domain,
            exportName: data.queryKeyName,
            filePath: `${data.domainRoot}/query-keys.ts`,
            importLine: `import { type ${data.queryName}Params } from './api/${data.queryKebabName}-api';`,
            queryName: data.queryName,
          });
        },
      ];
    },
  });

  plop.setGenerator('domain-mutation', {
    description: 'Create a domain-level API mutation scaffold.',
    prompts: [
      {
        type: 'list',
        name: 'app',
        message: 'Target app',
        choices: ['client'],
      },
      {
        type: 'input',
        name: 'domain',
        message: 'Domain folder (kebab-case)',
        filter: (value) => toKebabCase(value),
        validate: (value) => isKebabCase(value) || 'Use kebab-case. Example: reservation',
      },
      {
        type: 'input',
        name: 'mutationName',
        message: 'Mutation name (PascalCase)',
        validate: (value) => isPascalCase(value) || 'Use PascalCase. Example: UpdateReservation',
      },
    ],
    actions: (answers) => {
      const data = getDomainMutationData(getDomainMutationAnswers(answers));

      return [
        {
          type: 'add',
          path: `${data.domainRoot}/api/${data.mutationKebabName}-api.ts`,
          templateFile: 'templates/domain-mutation/mutation-api.ts.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.domainRoot}/hooks/use-${data.mutationKebabName}-mutation.ts`,
          templateFile: 'templates/domain-mutation/use-mutation.ts.hbs',
          data,
        },
        {
          type: 'add',
          path: `${data.domainRoot}/hooks/use-${data.mutationKebabName}-mutation.spec.md`,
          templateFile: 'templates/domain-mutation/use-mutation.spec.md.hbs',
          data,
        },
        () => {
          ensureGitkeepDirectory(`${data.domainRoot}/model`);
          ensureQueryKeysFile(`${data.domainRoot}/query-keys.ts`);

          return `Ensured ${data.domainRoot}/query-keys.ts for mutation invalidation TODOs.`;
        },
      ];
    },
  });
}
