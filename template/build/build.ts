import path from "node:path";
import { createRequire } from 'node:module';
import consola from 'consola';
import chalk from 'chalk';
import { type BuildOptions, type Format, build } from 'esbuild';
import GlobalsPlugin from 'esbuild-plugin-globals';
import vue from 'unplugin-vue/esbuild';
import { emptyDir } from 'fs-extra';
import { pathOutput, pathSrc } from './paths';
import { PACKAGE_GROUP, PACKAGE_NAME } from './env';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const buildBundle = () => {
  const getBuildOptions = (format: Format) => {
    const options: BuildOptions = {
      entryPoints: [
        path.resolve(pathSrc, "index.ts"),
        path.resolve(pathSrc, "global.ts"),
      ],
      target: "es2018",
      platform: "neutral",
      plugins: [
        vue({
          isProduction: true,
          sourceMap: false,
        }),
      ],
      bundle: true,
      format,
      minifySyntax: true,
      banner: {
        js: `/*! Icon Generate Vue v${version} */\n`,
      },
      outdir: pathOutput,
    };
    if (format === "iife") {
      options.plugins!.push(
        GlobalsPlugin({
          vue: "Vue",
        })
      );
      options.globalName = `${PACKAGE_GROUP}${PACKAGE_NAME}`.replace("@", "");
    } else {
      options.external = ["vue"];
    }

    return options;
  };
  const doBuild = async (minify: boolean) => {
    await Promise.all([
      build({
        ...getBuildOptions("esm"),
        entryNames: `[name]${minify ? ".min" : ""}`,
        minify,
      }),
      build({
        ...getBuildOptions("iife"),
        entryNames: `[name].iife${minify ? ".min" : ""}`,
        minify,
      }),
      build({
        ...getBuildOptions("cjs"),
        entryNames: `[name]${minify ? ".min" : ""}`,
        outExtension: { ".js": ".cjs" },
        minify,
      }),
    ]);
  };

  return Promise.all([doBuild(true), doBuild(false)]);
};

consola.info(chalk.blue("cleaning dist..."));
await emptyDir(pathOutput);
consola.info(chalk.blue("building..."));
await buildBundle();
