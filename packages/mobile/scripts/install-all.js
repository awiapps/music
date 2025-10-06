#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function findPackageDirs(dir, result = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (fs.existsSync(path.join(fullPath, "package.json"))) {
        result.push(fullPath);
      }
      findPackageDirs(fullPath, result);
    }
  }
  return result;
}

const rootDir = path.join(__dirname, "..");
const packageDirs = findPackageDirs(rootDir);

for (const dir of packageDirs) {
  console.log(`Installing packages in ${dir}`);
  execSync("pnpm install", { cwd: dir, stdio: "inherit" });
}
