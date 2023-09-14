import * as path from "node:path";
import { mkdir, readdir, unlink, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

export const ICON_BASE_DIRE = "../template/icon";

export const clearSvgPath = async (dir = ICON_BASE_DIRE) => {
  const iconDir = path.resolve(dir);
  if (existsSync(iconDir)) {
    await readdir(iconDir).then((files) => {
      return Promise.all(
        files.map((filename) => {
          const src = path.join(iconDir, filename);
          return stat(src).then((st) => {
            // 判断是否为文件
            if (st.isFile()) {
              if (/(?:\.svg)$/.test(filename)) {
                return unlink(src);
              }
            }
          });
        })
      );
    });
  }
  await mkdir(iconDir, { recursive: true });
};

export const writeSvgFile = async (name: string, content: string) =>
  await writeFile(
    path.resolve(ICON_BASE_DIRE, `${name}.svg`),
    content,
    "utf-8"
  );
