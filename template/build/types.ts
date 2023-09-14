import * as fs from "fs";
import * as path from "path";
import { pathOutput, pathSrc } from "./paths";
import { emptyDir, ensureDir } from "fs-extra";

async function clearDTSDirectory(dir: string) {
  await ensureDir(dir);
  await emptyDir(dir);
}

function copyDTSToDirectory(sourceDir: string, targetDir: string): void {
  const fileNames = fs.readdirSync(sourceDir);

  fileNames.forEach((fileName) => {
    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(targetDir, fileName);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      const nestedTargetDir = path.join(targetDir, fileName);
      fs.mkdirSync(nestedTargetDir, { recursive: true });
      copyDTSToDirectory(sourcePath, nestedTargetDir);
    } else if (fileName.endsWith(".d.ts")) {
      fs.copyFileSync(sourcePath, targetPath);
      fs.unlinkSync(sourcePath);
    }
  });
}

const pathType = path.resolve(pathOutput, "types");
await clearDTSDirectory(pathType);
copyDTSToDirectory(pathSrc, pathType);
