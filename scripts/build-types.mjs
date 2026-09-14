import { copyFileSync, mkdirSync } from 'node:fs';

// The declarations are pure ambient module augmentation (no default/named
// export whose shape differs between module systems), so the same file
// serves the "import" and "require" conditions - just under the extensions
// each resolver looks for.
mkdirSync('dist', { recursive: true });
copyFileSync('src/index.d.ts', 'dist/index.d.ts');
copyFileSync('src/index.d.ts', 'dist/index.d.mts');
copyFileSync('src/index.d.ts', 'dist/index.d.cts');
