import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const [label, args] of [
  ['Determinismo da geração', ['scripts/generate.mjs', '--check']],
  ['Testes de todas as ferramentas', ['scripts/test.mjs']],
  ['Build estático', ['scripts/build.mjs']],
]) {
  console.log(`\n${label}`);
  const child = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (child.error || child.status !== 0) process.exit(child.status || 1);
}
console.log('\nVerificação concluída. Contagem oficial separada: npm run count (requer cloc).');
