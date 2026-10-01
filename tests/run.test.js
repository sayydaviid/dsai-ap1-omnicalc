// Um processo para todas as suites: evita milhares de processos Node simultâneos.
import { readdir } from 'node:fs/promises';

for (const name of (await readdir(new URL('./conversions/', import.meta.url))).sort()) {
  if (name.endsWith('.test.js')) await import(`./conversions/${name}`);
}
await import('./catalog.test.js');
await import('./special.test.js');
await import('./infrastructure.test.js');
await import('./generator.test.js');
