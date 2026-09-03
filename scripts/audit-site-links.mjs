import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicRoot = new URL("../public/", import.meta.url);
const publicPath = fileURLToPath(publicRoot);
const files = readdirSync(publicRoot, { recursive: true }).filter((file) => [".html", ".js", ".txt", ".xml"].includes(extname(file)));
const failures = [];
const externalHosts = new Map();

for (const file of files) {
  const source = readFileSync(new URL(file, publicRoot), "utf8");
  if (/https?:\/\/(?:www\.)?jrgrace\.com/i.test(source)) failures.push(`${file}: contains a production-site URL`);
  if (extname(file) !== ".html") continue;
  for (const match of source.matchAll(/href=["']([^"']+)["']/g)) {
    const href = match[1];
    if (/^(?:mailto:|tel:|#)/i.test(href)) continue;
    if (/^https?:/i.test(href)) {
      const host = new URL(href).hostname;
      externalHosts.set(host, (externalHosts.get(host) || 0) + 1);
      continue;
    }
    const relativePath = href.split(/[?#]/)[0].replace(/^\//, "");
    if (!relativePath) continue;
    const target = join(publicPath, relativePath);
    if (!existsSync(target) && !existsSync(`${target}.html`)) failures.push(`${file}: missing local destination ${href}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Audited ${files.length} hosted content files.`);
console.log("No links or embedded URLs point to the jrgrace.com production website.");
console.log("All relative page and document links resolve to hosted files.");
console.log("External service hosts:");
for (const [host, count] of [...externalHosts].sort()) console.log(`- ${host}: ${count}`);
