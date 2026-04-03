#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(__dirname, "../templates");

const PM_VERSIONS: Record<string, string> = {
  pnpm: "pnpm@10.27.0",
  yarn: "yarn@1.22.22",
  npm: "npm@10.9.0",
};

type HandlerChoice = "node" | "lambda" | "both";

async function main() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.error("Usage: create-function-framework <project-name>");
    process.exit(1);
  }

  // Validate project name
  const validNamePattern = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/;
  if (!validNamePattern.test(projectName) || projectName.includes("..") || projectName.includes("/") || projectName.includes("\\")) {
    console.error(`Error: "${projectName}" is not a valid project name.`);
    console.error("Use lowercase letters, numbers, hyphens, dots, or underscores.");
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  const { pm, handlers } = await prompts([
    {
      type: "select",
      name: "pm",
      message: "Package manager:",
      choices: [
        { title: "pnpm", value: "pnpm" },
        { title: "yarn", value: "yarn" },
        { title: "npm", value: "npm" },
      ],
      initial: 0,
    },
    {
      type: "select",
      name: "handlers",
      message: "Handlers:",
      choices: [
        { title: "Node CLI only", value: "node" },
        { title: "Lambda only", value: "lambda" },
        { title: "Both", value: "both" },
      ],
      initial: 2,
    },
  ]);

  if (!pm || !handlers) {
    console.log("Cancelled.");
    process.exit(0);
  }

  console.log(`\nCreating ${projectName}...`);

  copyDir(path.join(templatesDir, "common"), targetDir);
  console.log("  ✓ common files");

  if (handlers === "node" || handlers === "both") {
    copyDir(path.join(templatesDir, "node"), targetDir);
    console.log("  ✓ node handler");
  }

  if (handlers === "lambda" || handlers === "both") {
    copyDir(path.join(templatesDir, "lambda"), targetDir);
    console.log("  ✓ lambda handler");
  }

  replaceInDir(targetDir, {
    "{{PROJECT_NAME}}": projectName,
    "{{PACKAGE_MANAGER}}": PM_VERSIONS[pm],
  });

  adjustDeps(targetDir, handlers as HandlerChoice);

  console.log(`\nDone! cd ${projectName} && ${pm} install`);
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceInDir(dir: string, replacements: Record<string, string>): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      replaceInDir(fullPath, replacements);
    } else {
      let content = fs.readFileSync(fullPath, "utf-8");
      let changed = false;

      for (const [placeholder, value] of Object.entries(replacements)) {
        if (content.includes(placeholder)) {
          content = content.replaceAll(placeholder, value);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

function adjustDeps(dir: string, handlers: HandlerChoice): void {
  const pkgPath = path.join(dir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  if (handlers === "node") {
    delete pkg.dependencies["@o3co/js.function-framework.lambda"];
    delete pkg.dependencies["deepmerge"];
    delete pkg.dependencies["@types/aws-lambda"];
  } else if (handlers === "lambda") {
    delete pkg.dependencies["@o3co/js.function-framework.node"];
    delete pkg.scripts.debug;
    delete pkg.scripts.command;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
