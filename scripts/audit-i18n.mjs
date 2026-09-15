import {readdirSync, readFileSync, existsSync} from 'node:fs';
import {join, relative} from 'node:path';
import matter from 'gray-matter';

function walk(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory()
      ? walk(join(dir, entry.name))
      : /\.mdx?$/.test(entry.name)
        ? [join(dir, entry.name)]
        : [],
  );
}
const rows = [];
for (const [source, plugin] of [
  ['docs', 'docs'],
  ['guides', 'docs-guides'],
  ['integrations', 'docs-integrations'],
  ['reference', 'docs-reference'],
]) {
  for (const file of walk(source)) {
    const translated = join(
      'i18n/fr',
      `docusaurus-plugin-content-${plugin}`,
      'current',
      relative(source, file),
    );
    if (!existsSync(translated)) {
      rows.push({
        page: file,
        status: 'English fallback',
        translation: translated,
      });
    } else {
      const en = matter(readFileSync(file, 'utf8')).data.description;
      const fr = matter(readFileSync(translated, 'utf8')).data.description;
      if (en && en === fr)
        rows.push({
          page: file,
          status: 'English description',
          translation: translated,
        });
    }
  }
}
console.log(JSON.stringify(rows, null, 2));
console.error(
  `${rows.length} remaining fallback or description translation tasks (informational, not an indexation verdict).`,
);
