import { existsSync, readFileSync, writeFileSync } from "fs";

const templatePath = ".env.staging.example";
const targetPath = ".env.staging";
const localPath = ".env.local";

function parseEnvFile(content: string) {
  const values: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;

    const [key, ...rest] = line.split("=");
    values[key.trim()] = rest.join("=").trim();
  }

  return values;
}

function replaceValue(content: string, key: string, value: string) {
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(content)) {
    return content.replace(pattern, `${key}=${value}`);
  }

  return `${content.trimEnd()}\n${key}=${value}\n`;
}

function main() {
  if (!existsSync(templatePath)) {
    console.error(`Missing template: ${templatePath}`);
    process.exit(1);
  }

  if (existsSync(targetPath)) {
    console.log(`${targetPath} already exists. No changes made.`);
    return;
  }

  let content = readFileSync(templatePath, "utf8");

  if (existsSync(localPath)) {
    const localEnv = parseEnvFile(readFileSync(localPath, "utf8"));
    const nextAuthSecret = localEnv.NEXTAUTH_SECRET;

    if (nextAuthSecret) {
      content = replaceValue(content, "NEXTAUTH_SECRET", nextAuthSecret);
    }
  }

  writeFileSync(targetPath, content);
  console.log(`Created ${targetPath} from ${templatePath}`);
  console.log(
    "Fill in the remaining staging-specific values: RDS, S3/CloudFront, admin, and email settings."
  );
}

main();
