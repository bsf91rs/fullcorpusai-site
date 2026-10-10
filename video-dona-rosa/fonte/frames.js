const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'); const { spawn } = require('child_process');
(async () => {
  const [,, html, out, fps = '30'] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(html)); await p.waitForTimeout(800);
  const total = await p.evaluate(() => TOTAL); const n = Math.round(total * +fps);
  const ff = spawn('ffmpeg', ['-loglevel','error','-y','-f','image2pipe','-framerate',fps,'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p',out], { stdio: ['pipe','inherit','inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => render(t), i / +fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${n} ${((Date.now()-t0)/1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', n);
})();
