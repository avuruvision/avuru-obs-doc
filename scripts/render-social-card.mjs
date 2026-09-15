import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';

// Code-native brand illustration, rendered at the dimensions declared in metadata.
const font = readFileSync(
  new URL('../static/fonts/inter-latin.woff2', import.meta.url),
).toString('base64');
const logo = readFileSync(
  new URL('../static/img/logo.svg', import.meta.url),
).toString('base64');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: {width: 1200, height: 630},
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:Inter;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}
    *{box-sizing:border-box}body{margin:0;background:#eaf1e8;color:#153628;font-family:Inter,system-ui,sans-serif}
    main{height:630px;padding:52px 65px;position:relative;overflow:hidden}
    header{display:flex;align-items:center;gap:12px;font-size:22px;font-weight:600;letter-spacing:-.6px}header img{width:32px;height:32px}
    .tag{margin-top:68px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#4c664f}
    h1{font-size:89px;line-height:1.07;font-weight:510;letter-spacing:-6px;margin:25px 0 24px;position:relative;z-index:2}h1 span{color:#5b7c61;font-weight:400}
    p{max-width:500px;font-size:19px;line-height:1.7;color:#4c664f;margin:0}
    footer{position:absolute;bottom:43px;left:65px;right:65px;display:flex;justify-content:space-between;border-top:1px solid #baccb5;padding-top:20px;color:#365c40;font-size:13px}
    svg{position:absolute;right:12px;top:117px;width:480px;height:400px;opacity:.55}path{stroke:#8baa77;stroke-width:1.5;fill:none}.node{fill:#e0ebd8;stroke:#648b51;stroke-width:2}
  </style></head><body><main><header><img src="data:image/svg+xml;base64,${logo}" alt="">Avuru Obs</header>
  <div class="tag">Open-source Kubernetes observability</div><h1>Nothing runs<br><span>alone.</span></h1>
  <p>Discover the dependencies.<br>Follow the request. Keep the context.</p>
  <svg viewBox="0 0 480 400" aria-hidden="true"><path d="M20 205C110 205 110 110 205 110S290 70 375 70M205 110C280 110 300 240 405 240M20 205C110 205 110 300 205 300S310 335 395 335M205 300C310 300 295 240 405 240"/>
  <g class="node"><path d="m20 185 18 10v20l-18 10-18-10v-20Z"/><path d="m205 90 18 10v20l-18 10-18-10v-20Z"/><path d="m205 280 18 10v20l-18 10-18-10v-20Z"/><path d="m375 50 18 10v20l-18 10-18-10v-20Z"/><path d="m405 220 18 10v20l-18 10-18-10v-20Z"/><path d="m395 315 18 10v20l-18 10-18-10v-20Z"/></g></svg>
  <footer><span>eBPF · OpenTelemetry · ClickHouse</span><span>avuruobs.io ↗</span></footer></main></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: new URL('../static/img/atlas-social-card.png', import.meta.url)
      .pathname,
  });
} finally {
  await browser.close();
}
