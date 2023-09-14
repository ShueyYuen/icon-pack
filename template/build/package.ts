import { writeFile } from "node:fs/promises";
import { pathOutput } from "./paths";
import path from "node:path";
import { ensureDir } from "fs-extra";
import {
  PACKAGE_GROUP,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  PACKAGE_DESCRIPTION,
  PACKAGE_REGISTRY,
  PACKAGE_AUTH_TOKEN,
} from "./env";
import consola from "consola";
import chalk from "chalk";

const PACKAGE = `{
  "name": "",
  "version": "",
  "description": "",
  "type": "module",
  "keywords": [
    "icon",
    "svg",
    "vue"
  ],
  "homepage": "",
  "files": [
    "types",
    "*.cjs",
    "*.js"
  ],
  "main": "./index.cjs",
  "module": "./index.js",
  "types": "./types/index.d.ts",
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "require": "./index.cjs",
      "import": "./index.js"
    },
    "./global": {
      "types": "./types/global.d.ts",
      "require": "./global.cjs",
      "import": "./global.js"
    },
    "./*": "./*"
  },
  "typesVersions": {
    "*": {
      "*": [
        "./*",
        "./types/*"
      ]
    }
  },
  "sideEffects": false,
  "peerDependencies": {
    "vue": "^3.2.0"
  }
}`;

const dumpPackageFile = async () => {
  await ensureDir(pathOutput);

  const file = JSON.parse(PACKAGE);

  file.name = `${PACKAGE_GROUP}/${PACKAGE_NAME}`;
  file.version = PACKAGE_VERSION;
  file.description = PACKAGE_DESCRIPTION;

  consola.info(chalk.blue("generate package.json..."));
  return writeFile(
    path.resolve(pathOutput, "package.json"),
    JSON.stringify(file, null, 2),
    "utf-8"
  );
};

const dumpNpmrcFile = async () => {
  await ensureDir(pathOutput);
  const registry = PACKAGE_REGISTRY.endsWith("/")
    ? PACKAGE_REGISTRY
    : `${PACKAGE_REGISTRY}/`;
  const noProtocol = registry.replace(/^https?:\/\//, "");
  consola.info(chalk.blue("generate .npmrc..."));
  return writeFile(
    path.resolve(pathOutput, ".npmrc"),
    `${PACKAGE_GROUP}:registry=${registry}
always-auth=true
//${noProtocol}:_authToken=${PACKAGE_AUTH_TOKEN}`,
    "utf-8"
  );
};

await dumpPackageFile();
await dumpNpmrcFile();
