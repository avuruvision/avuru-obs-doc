import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const locales = [
  {
    path: '/',
    title: 'Nothing runs alone.',
    carbon: 'Carbon',
    latency: 'Latency',
    missing: 'No energy attribution',
    pause: 'Pause motion',
    resume: 'Resume motion',
    full: 'Show full map',
    choose: 'Choose a service',
    docs: '/docs/signals/service-map/',
  },
  {
    path: '/fr/',
    title: 'Aucun service ne fonctionne seul.',
    carbon: 'Carbone',
    latency: 'Latence',
    missing: 'Aucune attribution énergétique',
    pause: 'Suspendre l’animation',
    resume: 'Reprendre l’animation',
    full: 'Voir la carte complète',
    choose: 'Choisir un service',
    docs: '/fr/docs/signals/service-map/',
  },
];

test.beforeEach(async ({page}) => {
  // Tests must work without analytics, GitHub or the live product.
  await page.route('https://**', (route) => route.abort());
});

for (const locale of locales) {
  test(`${locale.path} map selection, missing data, motion and documentation navigation`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({width: 1440, height: 1000});
    await page.goto(locale.path);
    await expect(page.getByRole('heading', {level: 1})).toHaveText(
      locale.title,
    );
    await page.getByRole('button', {name: locale.carbon, exact: true}).click();
    await page.locator('[data-service="postgres"]').click();
    const readout = page.locator('main aside');
    await expect(readout).toContainText(locale.missing);
    await expect(readout).toContainText('—');
    await expect(readout).not.toContainText('0 gCO');
    await page.getByRole('button', {name: locale.latency, exact: true}).click();
    await page.locator('[data-service="payment"]').focus();
    await page.keyboard.press('Enter');
    await expect(readout.getByRole('heading')).toHaveText('payment');
    await expect(readout).toContainText('790');
    await page.getByRole('button', {name: locale.pause, exact: true}).click();
    await expect(page.locator('[data-motion]')).toHaveAttribute(
      'data-motion',
      'false',
    );
    await page.getByRole('button', {name: locale.resume, exact: true}).click();
    await expect(page.locator('[data-motion]')).toHaveAttribute(
      'data-motion',
      'true',
    );
    await page.locator(`main a[href="${locale.docs}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(locale.docs));
    await expect(page.locator('main [data-service]')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute(
      'data-atlas',
      'true',
    );
    expect(errors).toEqual([]);
  });

  for (const width of [320, 390, 768, 1440]) {
    test(`${locale.path} usable at ${width}px with reduced motion`, async ({
      page,
    }) => {
      await page.setViewportSize({width, height: 900});
      await page.emulateMedia({reducedMotion: 'reduce'});
      await page.goto(locale.path);
      await expect(page.getByRole('heading', {level: 1})).toHaveText(
        locale.title,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator('[data-motion]')).toHaveAttribute(
        'data-motion',
        'false',
      );
      if (width < 600) {
        expect(
          await page.locator('[data-service]:visible').count(),
        ).toBeLessThanOrEqual(5);
        await page.getByLabel(locale.choose).selectOption('postgres');
        await expect(page.locator('main aside h3')).toHaveText('postgres');
        await page
          .getByRole('button', {name: locale.full, exact: true})
          .click();
        await expect(page.locator('[data-service]:visible')).toHaveCount(9);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
      }
    });
  }

  for (const width of [390, 1440]) {
    test(`${locale.path} accessibility at ${width}px`, async ({page}) => {
      await page.setViewportSize({width, height: 1000});
      await page.goto(locale.path);
      const result = await new AxeBuilder({page})
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations).toEqual([]);
    });
  }

  test(`${locale.path} core content and links work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({javaScriptEnabled: false});
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4173${locale.path}`);
    await expect(page.getByRole('heading', {level: 1})).toHaveText(
      locale.title,
    );
    await expect(page.locator('main aside h3')).toHaveText('checkout');
    await page.locator('main details summary').first().click();
    await expect(page.locator('main details').first()).toHaveAttribute(
      'open',
      '',
    );
    await page.locator(`main a[href="${locale.docs}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(locale.docs));
    await context.close();
  });
}

test('copy failure is recoverable and analytics failures never break the map', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {writeText: () => Promise.reject(new Error('denied'))},
    });
    Object.assign(window, {
      umami: {
        track: () => {
          throw new Error('blocked');
        },
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', {name: 'Copy command', exact: true}).click();
  await expect(page.getByRole('status')).toContainText('Copy unavailable');
  await page.getByRole('button', {name: 'Carbon', exact: true}).click();
  await expect(page.locator('main aside')).toContainText(
    'Illustrative TDP estimate',
  );
});

test('successful copy and product interactions emit only bounded navigation events', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const events: unknown[] = [];
    Object.assign(window, {
      atlasTestEvents: events,
      umami: {
        track: (name: string, data: unknown) => events.push({name, data}),
      },
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (value: string) => {
          Object.assign(window, {atlasTestCopy: value});
        },
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', {name: 'Carbon', exact: true}).click();
  await page.getByRole('button', {name: 'Copy command', exact: true}).click();
  await expect(page.getByRole('status')).toHaveText('Command copied');
  const result = await page.evaluate(() => {
    const state = window as unknown as {
      atlasTestEvents: {name: string; data: unknown}[];
      atlasTestCopy: string;
    };
    return {events: state.atlasTestEvents, command: state.atlasTestCopy};
  });
  expect(result.command).toContain('oci://ghcr.io/avuruvision/charts/avuruobs');
  expect(result.command).not.toContain('<X.Y.Z>');
  expect(result.events).toEqual([
    {name: 'map_interaction', data: {action: 'change_lens', lens: 'carbon'}},
    {name: 'install_copy', data: {platform: 'kubernetes'}},
  ]);
});

for (const locale of locales) {
  test(`${locale.path} installation platforms work by keyboard`, async ({
    page,
  }) => {
    await page.goto(`${locale.path}docs/getting-started/30-seconds/`);
    const kubernetes = page.getByRole('tab', {name: 'Kubernetes', exact: true});
    await kubernetes.focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      page.getByRole('tab', {name: 'Docker', exact: true}),
    ).toBeFocused();
    await expect(page.getByRole('tabpanel')).toContainText('docker compose');
    await page.keyboard.press('Home');
    await expect(kubernetes).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('svc/avuruobs-ui');
    await expect(page.getByRole('tabpanel')).not.toContainText('<X.Y.Z>');
  });
  test(`${locale.path} mobile navigation stays accessible`, async ({page}) => {
    await page.setViewportSize({width: 390, height: 900});
    await page.goto(locale.path);
    await page.locator('.navbar__toggle').click();
    await expect(page.locator('.navbar-sidebar')).toBeVisible();
    const result = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
