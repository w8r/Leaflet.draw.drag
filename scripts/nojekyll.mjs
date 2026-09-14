import { writeFileSync } from 'node:fs';

// GitHub Pages runs the published branch through Jekyll by default, which
// ignores files/folders starting with "_" - harmless here, but it also
// meddles with how assets are served. An empty .nojekyll file at the root
// of the deployed folder turns that off.
writeFileSync('dist/docs/.nojekyll', '');
