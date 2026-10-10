/* Motor de movimento dos sites Veras (ZX Digital, 10/2026). Sem biblioteca: funciona offline.
   O que faz, e por quê:
   - Rolagem com inércia no mouse e trackpad: a página segue a roda e desacelera aos poucos.
   - [data-progresso]: escreve --p (0 a 1) no elemento conforme ele atravessa a tela; o CSS decide o movimento.
     Em seção presa (sticky), --p mede o percurso da seção inteira.
   - canvas[data-seq]: sequência de quadros que acompanha a rolagem (vídeo que "anda" com o dedo).
   - video[data-auto]: toca só quando aparece na tela; fora dela, pausa (bateria e memória do celular).
   - [data-letras]: separa as palavras para revelarem em cascata quando o bloco aparece.
   - .surge: entra com leve subida quando aparece.
   - [data-hover-video]: no computador, o vídeo do card toca ao passar o mouse.
   - [data-marquee]: faixa de texto que corre e acelera com a velocidade da rolagem.
   - Quem pede menos movimento no aparelho recebe a página parada e completa. */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fino = window.matchMedia('(pointer:fine)').matches;
  if (reduz) doc.classList.add('parado');
  function lim(v) { return Math.max(0, Math.min(1, v)); }

  /* ---------- Palavras em cascata ---------- */
  [].slice.call(document.querySelectorAll('[data-letras]')).forEach(function (el) {
    var i = 0;
    (function quebra(no) {
      [].slice.call(no.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span'); s.className = 'pal';
            var d = document.createElement('span'); d.textContent = w; d.style.setProperty('--i', i++);
            s.appendChild(d); frag.appendChild(s);
          });
          no.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') quebra(n);
      });
    })(el);
  });

  /* ---------- Entradas quando aparecem ---------- */
  var vistos = document.querySelectorAll('.surge,[data-letras]');
  if (reduz || !('IntersectionObserver' in window)) {
    [].forEach.call(vistos, function (e) { e.classList.add('visivel'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    [].forEach.call(vistos, function (e) { io.observe(e); });
  }

  /* ---------- Vídeos que tocam só quando aparecem ---------- */
  var videos = [].slice.call(document.querySelectorAll('video[data-auto]'));
  videos.forEach(function (v) { v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); });
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduz) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.15 });
    videos.forEach(function (v) { vo.observe(v); });
  }
  if (fino) {
    [].slice.call(document.querySelectorAll('[data-hover-video]')).forEach(function (c) {
      var v = c.querySelector('video'); if (!v) return;
      v.removeAttribute('data-auto');
      c.addEventListener('mouseenter', function () { if (!reduz) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
      c.addEventListener('mouseleave', function () { v.pause(); });
    });
  }

  /* ---------- Sequências de quadros ---------- */
  var seqs = [].slice.call(document.querySelectorAll('canvas[data-seq]')).map(function (cv) {
    var n = +cv.getAttribute('data-n'), base = cv.getAttribute('data-seq'), ext = cv.getAttribute('data-ext') || 'webp';
    var s = { cv: cv, ctx: cv.getContext('2d'), n: n, imgs: new Array(n), atual: -1, alvo: 0, quadro: 0,
              dono: cv.closest('[data-progresso]') || cv.parentNode };
    function nome(i) { var k = String(i + 1); while (k.length < 3) k = '0' + k; return base + '/q' + k + '.' + ext; }
    function carrega(i) {
      if (s.imgs[i]) return;
      var im = new Image(); im.decoding = 'async'; im.src = nome(i); s.imgs[i] = im;
      im.onload = function () { if (Math.abs(i - s.quadro) < 3) s.atual = -1; };
    }
    // primeiro o quadro inicial, depois um a cada 4, depois o resto: a sequência fica usável cedo
    carrega(0);
    s.carregar = function () {
      if (s.pronto) return; s.pronto = true;
      for (var i = 0; i < n; i += 4) carrega(i);
      setTimeout(function () { for (var i = 0; i < n; i++) carrega(i); }, 400);
    };
    s.mede = function () {
      var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); s.atual = -1;
    };
    s.desenha = function (i) {
      var im = s.imgs[i];
      if (!im || !im.complete || !im.naturalWidth) { // usa o quadro carregado mais perto
        for (var d = 1; d < n; d++) {
          var a = s.imgs[i - d], b = s.imgs[i + d];
          if (a && a.complete && a.naturalWidth) { im = a; break; }
          if (b && b.complete && b.naturalWidth) { im = b; break; }
        }
      }
      if (!im || !im.naturalWidth) return;
      var W = cv.width, H = cv.height, r = Math.max(W / im.naturalWidth, H / im.naturalHeight);
      var w = im.naturalWidth * r, h = im.naturalHeight * r;
      s.ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
    };
    s.mede();
    return s;
  });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) seqs.forEach(function (s) { if (s.dono === e.target || s.cv === e.target) s.carregar(); }); });
    }, { rootMargin: '600px 0px' });
    seqs.forEach(function (s) { so.observe(s.dono); });
  } else seqs.forEach(function (s) { s.carregar(); });

  /* ---------- Progresso por elemento ---------- */
  var prog = [].slice.call(document.querySelectorAll('[data-progresso]'));
  var marquees = [].slice.call(document.querySelectorAll('[data-marquee]')).map(function (m) { return { el: m, x: 0 }; });
  var ultimoY = window.scrollY, vel = 0;
  var ganchos = [];
  window.MotorVeras = { quadro: function (fn) { ganchos.push(fn); } };

  function progresso(el, h) {
    var r = el.getBoundingClientRect();
    if (el.hasAttribute('data-preso')) return lim(-r.top / Math.max(1, r.height - h)); // seção presa: percurso inteiro
    return lim((h - r.top) / (h + r.height)); // atravessando a tela
  }
  function quadro() {
    var h = window.innerHeight, y = window.scrollY;
    vel += ((y - ultimoY) - vel) * 0.2; ultimoY = y;
    prog.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -h || r.top > h * 2) return;
      el.style.setProperty('--p', progresso(el, h).toFixed(4));
    });
    seqs.forEach(function (s) {
      var p = s.dono.hasAttribute('data-progresso') ? progresso(s.dono, h) : 0;
      s.quadro = Math.min(s.n - 1, Math.round(p * (s.n - 1)));
      if (s.quadro !== s.atual) { s.desenha(s.quadro); s.atual = s.quadro; }
    });
    if (!reduz) marquees.forEach(function (m) {
      var w = m.el.scrollWidth / 2;
      m.x -= 0.6 + Math.abs(vel) * 0.25;
      if (-m.x > w) m.x += w;
      m.el.style.transform = 'translate3d(' + m.x.toFixed(1) + 'px,0,0) skewX(' + Math.max(-8, Math.min(8, -vel * 0.15)).toFixed(2) + 'deg)';
    });
    ganchos.forEach(function (fn) { fn(y, h, vel); });
    requestAnimationFrame(quadro);
  }
  window.addEventListener('resize', function () { seqs.forEach(function (s) { s.mede(); }); });
  requestAnimationFrame(quadro);

  /* ---------- Rolagem com inércia (mouse e trackpad) ---------- */
  if (!reduz && fino) {
    doc.style.scrollBehavior = 'auto';
    var alvoY = window.scrollY, atualY = window.scrollY, deslizando = false;
    function maxY() { return doc.scrollHeight - window.innerHeight; }
    function desliza() {
      atualY += (alvoY - atualY) * 0.085;
      if (Math.abs(alvoY - atualY) < 0.4) { atualY = alvoY; deslizando = false; }
      window.scrollTo(0, atualY);
      if (deslizando) requestAnimationFrame(desliza);
    }
    function vaiPara(y) {
      alvoY = Math.max(0, Math.min(maxY(), y));
      if (!deslizando) { deslizando = true; atualY = window.scrollY; requestAnimationFrame(desliza); }
    }
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.defaultPrevented) return;
      e.preventDefault();
      var d = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (!deslizando) alvoY = window.scrollY;
      vaiPara(alvoY + d);
    }, { passive: false });
    window.addEventListener('scroll', function () { if (!deslizando) { alvoY = atualY = window.scrollY; } }, { passive: true });
    [].slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var t = document.querySelector(id); if (!t) return;
        e.preventDefault(); vaiPara(t.getBoundingClientRect().top + window.scrollY);
      });
    });
  }

  /* ---------- Cursor com rótulo (só no computador) ---------- */
  if (fino && !reduz && document.querySelector('.cursor')) {
    var cur = document.querySelector('.cursor'), rot = cur.querySelector('span');
    var cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var alvo = e.target.closest('[data-cursor]');
      cur.classList.toggle('grande', !!alvo);
      rot.textContent = alvo ? alvo.getAttribute('data-cursor') : '';
      cur.classList.toggle('link', !alvo && !!e.target.closest('a,button'));
    });
    (function anda() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      requestAnimationFrame(anda);
    })();
    doc.classList.add('com-cursor');
  }
})();
