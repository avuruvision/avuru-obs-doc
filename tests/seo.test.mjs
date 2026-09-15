import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {load} from 'cheerio';

const origin = 'https://avuruobs.io';
const build = new URL('../build/', import.meta.url).pathname;
function html(path) {
  const file = join(build, path, path.endsWith('/') ? 'index.html' : '');
  assert.ok(existsSync(file), `Missing rendered page: ${path}`);
  return load(readFileSync(file, 'utf8'));
}
function walk(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

// Follow the sitemap, rather than testing only hard-coded example canonicals.
test('all sitemap URLs resolve to pre-rendered pages with matching canonicals and reciprocal languages', () => {
  let count = 0;
  for (const sitemap of ['sitemap.xml', 'fr/sitemap.xml']) {
    const xml = load(readFileSync(join(build, sitemap), 'utf8'), {
      xmlMode: true,
    });
    const urls = xml('url > loc')
      .map((_, element) => xml(element).text())
      .get();
    assert.ok(urls.length > 100);
    assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap entry');
    for (const url of urls) {
      const parsed = new URL(url);
      assert.equal(parsed.origin, origin);
      assert.ok(parsed.pathname.endsWith('/'), `Non-final sitemap URL: ${url}`);
      const $ = html(parsed.pathname);
      assert.equal(
        $('link[rel="canonical"]').attr('href'),
        url,
        `Canonical disagrees: ${url}`,
      );
      $('link[rel="alternate"][hreflang]').each((_, alternate) => {
        const href = $(alternate).attr('href');
        assert.ok(href.endsWith('/'), `Non-final alternate: ${href}`);
        const other = html(new URL(href).pathname);
        const ownLanguage = $('html').attr('lang');
        assert.equal(
          other(`link[hreflang="${ownLanguage}"]`).attr('href'),
          url,
          `Missing reciprocal link from ${href}`,
        );
      });
      count++;
    }
  }
  console.log(
    `Validated ${count} sitemap URLs, canonicals and language alternates.`,
  );
});

test('Atlas is meaningful and indexable before JavaScript, in both languages', () => {
  for (const [path, locale, heading] of [
    ['/', 'en', 'Nothing runs alone.'],
    ['/fr/', 'fr', 'Aucun service ne fonctionne seul.'],
  ]) {
    const $ = html(path);
    assert.equal($('html').attr('lang'), locale);
    assert.equal($('h1').length, 1);
    assert.equal($('h1').text(), heading);
    assert.match(
      $('title').text(),
      locale === 'fr' ? /Observabilité Kubernetes/ : /Kubernetes Observability/,
    );
    assert.ok($('meta[name="description"]').attr('content').length > 80);
    assert.equal($('meta[name="keywords"]').length, 0);
    assert.doesNotMatch(
      $('meta[name="robots"]').attr('content') || '',
      /noindex/,
    );
    assert.equal($('[data-service]').length, 9);
    assert.ok($('main').text().includes('OpenTelemetry'));
    assert.ok($('main').text().includes('ClickHouse'));
    assert.equal($('main iframe').length, 0);
    assert.equal($('meta[property="og:image"]').length, 1);
    assert.match(
      $('meta[property="og:image"]').attr('content'),
      /atlas-social-card\.png$/,
    );
    const schema = JSON.parse($('script[type="application/ld+json"]').text());
    assert.ok(
      schema['@graph'].some((item) => item['@type'] === 'SoftwareApplication'),
    );
    assert.ok(!schema['@graph'].some((item) => item.aggregateRating));
  }
});

test('landing and acquisition links reach real pages and anchors, including French downloads', () => {
  const paths = [
    '/',
    '/docs/getting-started/30-seconds/',
    '/docs/setup/kubernetes/',
    '/docs/setup/otel-bridge/',
    '/docs/setup/modules/',
    '/docs/signals/service-map/',
    '/docs/signals/traces/',
    '/docs/signals/logs/',
    '/docs/signals/metrics/',
    '/integrations/languages/go/',
    '/integrations/databases/postgresql/',
    '/guides/investigate-slow-checkout/',
  ];
  for (const prefix of ['', '/fr']) {
    for (const path of paths) {
      const source = prefix + path;
      const $ = html(source);
      $('main a[href]').each((_, anchor) => {
        const href = $(anchor).attr('href');
        if (/^(mailto:|tel:)/.test(href)) return;
        const target = new URL(href, origin + source);
        if (target.origin !== origin) return;
        const file = join(
          build,
          decodeURI(target.pathname),
          target.pathname.endsWith('/') ? 'index.html' : '',
        );
        assert.ok(existsSync(file), `${source} -> missing ${target.pathname}`);
        if (target.hash && file.endsWith('.html')) {
          const page = load(readFileSync(file, 'utf8'));
          const id = decodeURIComponent(target.hash.slice(1));
          assert.ok(
            page('[id]')
              .toArray()
              .some((element) => page(element).attr('id') === id),
            `${source} -> missing anchor ${target.pathname}#${id}`,
          );
        }
      });
    }
  }
});

test('priority French pages are translated and the build retains the existing routes', () => {
  for (const path of [
    'docs/signals/traces/',
    'docs/signals/logs/',
    'docs/signals/metrics/',
    'docs/setup/kubernetes/',
    'docs/setup/otel-bridge/',
    'integrations/languages/go/',
    'integrations/databases/postgresql/',
    'guides/investigate-slow-checkout/',
  ]) {
    const en = html('/' + path);
    const fr = html('/fr/' + path);
    assert.notEqual(
      fr('meta[name="description"]').attr('content'),
      en('meta[name="description"]').attr('content'),
      `Untranslated description: ${path}`,
    );
    assert.notEqual(
      fr('h1').text(),
      en('h1').text(),
      `Untranslated heading: ${path}`,
    );
  }
  assert.ok(walk(build).filter((file) => file.endsWith('.html')).length >= 388);
  assert.ok(existsSync(join(build, '404.html')));
  assert.ok(existsSync(join(build, 'google71d73d40157d7709.html')));
});

test('not-found output is branded and excluded from indexing', () => {
  for (const path of ['/404.html', '/fr/404.html']) {
    const $ = html(path);
    assert.equal($('meta[name="robots"]').attr('content'), 'noindex');
    assert.equal($('h1').length, 1);
    assert.ok($('main a[href]').length >= 2);
  }
});
