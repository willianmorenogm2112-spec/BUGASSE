import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(here, '..');
const project = path.resolve(skillDir, '..', '..', '..');
const config = JSON.parse(fs.readFileSync(path.join(skillDir, 'references', 'skill-coverage.json'), 'utf8'));
const covered = new Set(Object.values(config).flat());
const roots = process.argv.slice(2).length ? process.argv.slice(2) : [
  path.join(project, '.agents', 'skills'),
  path.resolve(project, '..', '.agents', 'skills'),
  path.resolve(project, '..', 'BUGASSE', '.agents', 'skills'),
];

const installed = new Set();
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory() && fs.existsSync(path.join(root, entry.name, 'SKILL.md'))) installed.add(entry.name);
  }
}

const missing = [...installed].filter((name) => !covered.has(name)).sort();
const stale = [...covered].filter((name) => !installed.has(name)).sort();
console.log(`Skills instaladas: ${installed.size}; cobertas: ${installed.size - missing.length}.`);
if (stale.length) console.log(`Mapeadas mas não presentes neste checkout: ${stale.join(', ')}`);
if (missing.length) {
  console.error(`Sem adaptação 3D: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Cobertura 3D completa para as skills instaladas.');
