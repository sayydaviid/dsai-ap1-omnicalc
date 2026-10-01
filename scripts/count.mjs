import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const cloc = process.env.CLOC || 'cloc';
const exclusions = ['--exclude-lang=Markdown,JSON,YAML,CSV,Text,SVG', '--not-match-f=(lock|\\.min\\.)'];
const dirs = 'node_modules,vendor,dist,build,prompts';
function run(args) {
  const result = spawnSync(cloc, args, { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    throw new Error(`Falha no cloc. Instale o cloc e confirme que está no PATH. ${result.error?.message || result.stderr}`);
  }
  return result.stdout;
}
await mkdir(path.join(root, 'reports'), { recursive: true });
const temp = await mkdtemp(path.join(tmpdir(), 'omnicalc-cloc-'));
try {
  const tracked = spawnSync('git', ['ls-files', 'tests'], { cwd: root, encoding: 'utf8' });
  if (tracked.status !== 0) throw new Error('Esta pasta precisa conter o histórico Git. Extraia o ZIP inteiro.');
  const testList = path.join(temp, 'tests.txt');
  await writeFile(testList, tracked.stdout);
  const common = ['.', '--vcs=git', `--exclude-dir=${dirs}`, ...exclusions];
  const totalText = run(common);
  const total = JSON.parse(run([...common, '--json']));
  const application = JSON.parse(run(['.', '--vcs=git', `--exclude-dir=${dirs},tests`, ...exclusions, '--json']));
  const tests = JSON.parse(run([`--list-file=${testList}`, ...exclusions, '--json']));
  const counts = { total: total.SUM.code, application: application.SUM.code, tests: tests.SUM.code };
  if (counts.total !== counts.application + counts.tests) throw new Error('Contagens inconsistentes. Revise as exclusões.');
  const summary = `${counts.total.toLocaleString('pt-BR')} LOC totais; ${counts.application.toLocaleString('pt-BR')} aplicação/infraestrutura; ${counts.tests.toLocaleString('pt-BR')} testes.`;
  await writeFile(path.join(root, 'reports/cloc-total.txt'), totalText);
  await writeFile(path.join(root, 'reports/cloc-counts.json'), JSON.stringify({ counts, total, application, tests }, null, 2));
  const block = `<!-- CLOC:START -->\n\n${summary}\n\n\`\`\`text\n${totalText.trim()}\n\`\`\`\n\n<!-- CLOC:END -->`;
  const readmePath = path.join(root, 'README.md');
  const readme = await readFile(readmePath, 'utf8');
  await writeFile(readmePath, readme.replace(/<!-- CLOC:START -->[\s\S]*?<!-- CLOC:END -->/, block));
  console.log(totalText);
  console.log(summary);
  if (counts.total < 100000) { console.error('Total abaixo de 100.000 LOC.'); process.exitCode = 1; }
} finally { await rm(temp, { recursive: true, force: true }); }
