import { spawn } from 'node:child_process';
import { mkdir, createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { promisify } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
await promisify(mkdir)(path.join(root, 'reports'), { recursive: true });
const log = createWriteStream(path.join(root, 'reports/tests.tap.txt'));
const child = spawn(process.execPath, ['--test', '--test-reporter=tap', 'tests/run.test.js'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let remainder = '';
let failures = 0;
let completed = 0;
child.stdout.on('data', (chunk) => {
  log.write(chunk);
  remainder += chunk;
  const lines = remainder.split('\n');
  remainder = lines.pop();
  for (const line of lines) {
    if (/^\s*not ok /.test(line)) failures++;
    if (/^ok /.test(line)) {
      completed++;
      if (completed % 400 === 0) console.log(`${completed} suites processadas…`);
    }
    if (/^# (tests|suites|pass|fail|cancelled|skipped|todo|duration_ms) /.test(line)) console.log(line.slice(2));
  }
});
child.stderr.on('data', (chunk) => { log.write(chunk); process.stderr.write(chunk); });
child.on('error', (error) => { console.error(error.message); log.end(); process.exitCode = 1; });
child.on('close', (code) => {
  log.end();
  console.log(`Relatório completo: reports/tests.tap.txt${failures ? ` (${failures} falhas de teste/suite)` : ''}`);
  process.exitCode = code || (failures ? 1 : 0);
});
