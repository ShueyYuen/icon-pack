import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { emptyDir, ensureDir } from 'fs-extra';
import consola from 'consola';
import camelcase from 'camelcase';
import glob from 'fast-glob';
import { type BuiltInParserName, format } from 'prettier';
import chalk from 'chalk';
import { pathComponents, pathIcon, pathSrc } from './paths';
import { PACKAGE_PREFIX } from './env';

const getSvgFiles = async () => {
  return glob('*.svg', { cwd: pathIcon, absolute: true });
};

const getName = (file: string) => {
  const filename = path.basename(file).replace('.svg', '');
  const componentName = camelcase(filename, { pascalCase: true });
  return {
    filename,
    componentName,
  };
};

const formatCode = (code: string, parser: BuiltInParserName = 'typescript') =>
  format(code, {
    parser,
    semi: false,
    singleQuote: true,
  });

// 如果代码中包含script以及style标签，需要转换为<component is="">的写法
const transformSvgAnimation = (content: string) =>
  content.replace(
    /<(script|style)([\s\S]*?)<\/\1>/g,
    (match, p0, p1) => `<component is="${p0}"${p1}</component>`
  );

const transformToVueComponent = async (file: string) => {
  const content = await readFile(file, 'utf-8');
  const { filename, componentName } = getName(file);
  const vue = formatCode(
    `
<template>
${transformSvgAnimation(content)}
</template>
<script lang="ts">
import type { DefineComponent } from 'vue'
export default ({
  name: "${componentName}",
}) as DefineComponent
</script>`,
    'vue'
  );
  writeFile(path.resolve(pathComponents, `${filename}.vue`), vue, 'utf-8');
};

const generateEntry = async (files: string[]) => {
  const code = formatCode(
    files
      .map((file) => {
        const { filename, componentName } = getName(file);
        return `export { default as ${componentName} } from './${filename}.vue'`;
      })
      .join('\n')
  );
  await writeFile(path.resolve(pathComponents, 'index.ts'), code, 'utf-8');
};

consola.info(chalk.blue('generating vue components'));

await ensureDir(pathSrc);
await emptyDir(pathSrc);
await writeFile(path.resolve(pathSrc, 'index.ts'), "export * from './components';\n", 'utf-8');

await writeFile(
  path.resolve(pathSrc, 'global.ts'),
  `import { type App } from "vue";
import * as icons from "./components";

export interface InstallOptions {
  prefix?: string;
}
export default (app: App, { prefix = "PACKAGE_PREFIX" }: InstallOptions = {}) => {
  for (const [key, component] of Object.entries(icons)) {
    app.component(prefix + key, component);
  }
};

export { icons };
export * from "./components";`.replace(
    'PACKAGE_PREFIX',
    camelcase(PACKAGE_PREFIX, { pascalCase: true })
  ),
  'utf-8'
);

await ensureDir(pathComponents);
await emptyDir(pathComponents);
const files = await getSvgFiles();

consola.info(chalk.blue('generating vue files'));
await Promise.all(files.map((file) => transformToVueComponent(file)));

consola.info(chalk.blue('generating entry file'));
await generateEntry(files);
