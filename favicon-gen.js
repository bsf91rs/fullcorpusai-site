(function () {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  var ctx = canvas.getContext('2d');

  // Resolve path to the logo (works from root and /en/ subfolder)
  var base = document.currentScript
    ? document.currentScript.src.replace(/favicon-gen\.js.*$/, '')
    : (location.pathname.indexOf('/en/') !== -1 ? '../' : '');

  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, 64, 64);
    var link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
    document.head.appendChild(link);
  };
  img.src = base + 'arvore_azul_escura_sem_fundo_945px_300dpi.png';
})();
