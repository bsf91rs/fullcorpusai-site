(function () {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  var ctx = canvas.getContext('2d');

  // Dark rounded-square background
  ctx.fillStyle = '#0b1221';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(0, 0, 64, 64, 10);
    ctx.fill();
  } else {
    // Fallback for older browsers
    var r = 10, w = 64, h = 64;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
  }

  // Resolve path to the logo (works from root and /en/ subfolder)
  var base = document.currentScript
    ? document.currentScript.src.replace(/favicon-gen\.js.*$/, '')
    : (location.pathname.indexOf('/en/') !== -1 ? '../' : '');

  var img = new Image();
  img.onload = function () {
    var pad = 7;
    ctx.drawImage(img, pad, pad, 64 - pad * 2, 64 - pad * 2);
    var link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
    document.head.appendChild(link);
  };
  img.src = base + 'fullcorpus_ai_transparente_alta.png';
})();
