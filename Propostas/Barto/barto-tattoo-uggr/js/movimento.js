/* Estúdio Bartô Tattoo · movimento (vbeta6). Melhoria progressiva: sem este arquivo nada some e nada trava.
   Com "reduzir movimento" ligado no aparelho, nada aqui se mexe: o vídeo não carrega, nada entra animado. */
(function () {
  var d = document, w = window;
  var calmo = !!(w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches);
  /* fora da tela, o que anda em laço fica parado (classe .fora) */
  var vigia = "IntersectionObserver" in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("fora", !e.isIntersecting); });
  }) : null;
  function vigiar(el) { if (vigia) vigia.observe(el); }

  /* 1. Vídeo da hero: entra depois da página carregada (o pôster é a imagem principal), nunca com
        movimento reduzido nem com economia de dados. Sem botão de pausa desde a vbeta9 (pedido do Gabriel em 24/10):
        o vídeo é fundo mudo, e só toca com a hero na tela. */
  var v = d.querySelector(".heroi-video");
  function tocar() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function poeVideo() {
    if (!v || calmo) return;
    var c = navigator.connection || {};
    if (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")) return;
    /* navegador sem H.264 (raro): fica o pôster, e nada é baixado à toa */
    if (!v.canPlayType || !v.canPlayType('video/mp4; codecs="avc1.640028"')) return;
    var largo = w.matchMedia("(min-width: 960px)").matches;
    v.muted = true;
    v.src = v.getAttribute(largo ? "data-src-g" : "data-src-p");
    v.addEventListener("playing", function () {
      v.classList.add("rodando");
    }, { once: true });
    tocar();
    if ("IntersectionObserver" in w) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) tocar(); else v.pause();
        });
      }).observe(v);
    }
  }
  if (v) {
    if (d.readyState === "complete") setTimeout(poeVideo, 400);
    else w.addEventListener("load", function () { setTimeout(poeVideo, 400); });
  }

  /* 2. Entrada ao rolar: só o que ainda está abaixo da tela quando a página abre. */
  var SEL = "main .secao-cabeca, main .cartao, main .passo, main .duas > *, " +
            "main .colunas-2 > *, main .cuidados-resumo li, main .galeria .figura, main .tipos > *, " +
            "main .estudio-texto, main .mosaico > figure, main .artigo-bloco, main .autor";
  if (!calmo && "IntersectionObserver" in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    var alvos = d.querySelectorAll(SEL), h = w.innerHeight;
    for (var i = 0; i < alvos.length; i++) {
      var el = alvos[i];
      if (el.getBoundingClientRect().top > h) {
        var irmaos = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.style.transitionDelay = (Math.max(0, irmaos) % 4) * 80 + "ms";
        el.classList.add("espera");
        io.observe(el);
      }
    }
  }

  /* 3. Galeria do trabalho. Com movimento, vira um laço contínuo (vbeta6): quem anda é o CSS; aqui só se duplicam
        as peças, e a cópia fica fora da leitura de tela e do Tab. Para com foco e no botão; o mouse em cima não para (vbeta7, pedido do Gabriel).
        Com movimento reduzido (ou sem este arquivo), é a galeria arrastável: no toque, a rolagem nativa; no mouse,
        arrastar e as setas. */
  var trilhos = d.querySelectorAll("[data-trilho]");
  Array.prototype.forEach.call(trilhos, function (sec) {
    var t = sec.querySelector(".trilho"), ant = sec.querySelector(".trilho-ant"), prox = sec.querySelector(".trilho-prox");
    if (!t || !ant || !prox) return;
    var jan = sec.querySelector(".trilho-janela");
    if (!calmo && jan) {  /* sem botão de pausar desde a vbeta10 (pedido do Gabriel em 24/10) */
      Array.prototype.forEach.call(t.querySelectorAll(".peca"), function (li) {
        var c = li.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        c.setAttribute("inert", "");
        Array.prototype.forEach.call(c.querySelectorAll("a, button, [tabindex]"), function (a) { a.tabIndex = -1; });
        t.appendChild(c);
      });
      sec.classList.add("trabalho-auto");
      /* o Tab rola a janela até a peça focada; ao sair dela, o laço volta ao lugar */
      jan.addEventListener("focusout", function (e) { if (!jan.contains(e.relatedTarget)) jan.scrollLeft = 0; });
      vigiar(sec);
      return;
    }
    function passo() { var f = t.querySelector(".peca"); return f ? f.getBoundingClientRect().width + 16 : 300; }
    function estado() {
      ant.disabled = t.scrollLeft < 4;
      prox.disabled = t.scrollLeft + t.clientWidth > t.scrollWidth - 4;
    }
    ant.hidden = false; prox.hidden = false;
    ant.addEventListener("click", function () { t.scrollBy({ left: -passo(), behavior: calmo ? "auto" : "smooth" }); });
    prox.addEventListener("click", function () { t.scrollBy({ left: passo(), behavior: calmo ? "auto" : "smooth" }); });
    t.addEventListener("scroll", estado, { passive: true });
    w.addEventListener("resize", estado);
    estado();
    var x0 = 0, s0 = 0, arrastando = false, moveu = false;
    t.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      arrastando = true; moveu = false; x0 = e.clientX; s0 = t.scrollLeft;
    });
    w.addEventListener("pointermove", function (e) {
      if (!arrastando) return;
      var dx = e.clientX - x0;
      if (!moveu && Math.abs(dx) > 5) { moveu = true; t.classList.add("arrastando"); }
      if (moveu) t.scrollLeft = s0 - dx;
    });
    w.addEventListener("pointerup", function () {
      if (!arrastando) return;
      arrastando = false; t.classList.remove("arrastando");
    });
    t.addEventListener("click", function (e) { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
    t.addEventListener("dragstart", function (e) { e.preventDefault(); });
  });

  /* 6. Letreiro dos números: só para fora da tela. Sem pausa por toque ou tecla desde a vbeta10 (pedido do Gabriel em 24/10). */
  Array.prototype.forEach.call(d.querySelectorAll("[data-letreiro]"), function (l) { vigiar(l); });

  /* 5. O estúdio: as fotos do mosaico deslizam de leve dentro da moldura ao rolar.
        O deslocamento fica abaixo da sobra do zoom, então a borda da foto nunca aparece. */
  var mos = d.querySelector(".mosaico");
  if (mos && !calmo && "IntersectionObserver" in w) {
    var fotos = mos.querySelectorAll("img"), ativo = false, rq = 0;
    var quadro = function () {
      rq = 0;
      var r = mos.getBoundingClientRect(), vh = w.innerHeight;
      var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      for (var k = 0; k < fotos.length; k++) {
        var amp = Math.min(12, fotos[k].clientHeight * 0.03);
        fotos[k].style.transform = "translate3d(0," + ((0.5 - p) * 2 * amp).toFixed(1) + "px,0) scale(1.08)";
      }
    };
    var rolou = function () { if (ativo && !rq) rq = requestAnimationFrame(quadro); };
    new IntersectionObserver(function (es) { ativo = es[0].isIntersecting; rolou(); }).observe(mos);
    w.addEventListener("scroll", rolou, { passive: true });
    w.addEventListener("resize", rolou);
  }

  /* 4. Luz que segue o cursor, só em tela com mouse: uma lâmpada de estúdio, bem fraca. */
  if (!calmo && w.matchMedia && w.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    Array.prototype.forEach.call(d.querySelectorAll("[data-luz]"), function (el) {
      var raf = 0, x = 0, y = 0;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top;
        if (!raf) raf = requestAnimationFrame(function () {
          el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px");
          el.classList.add("com-luz"); raf = 0;
        });
      });
      el.addEventListener("pointerleave", function () { el.classList.remove("com-luz"); });
    });
  }

  /* 5. Painéis do topo (Menu e Trabalhos). Sem este bloco eles abrem e fecham pelo <details> nativo, inclusive
        pelo teclado. Com ele: um aberto por vez, Esc fecha e devolve o foco, clique ou foco fora fecha. */
  var paineis = d.querySelectorAll(".topo details");
  function fechaOutros(exceto) {
    Array.prototype.forEach.call(paineis, function (p) { if (p !== exceto) p.open = false; });
  }
  Array.prototype.forEach.call(paineis, function (p) {
    p.addEventListener("toggle", function () { if (p.open) fechaOutros(p); });
    p.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && p.open) {
        p.open = false; var s = p.querySelector("summary"); if (s) s.focus(); e.stopPropagation();
      }
    });
    p.addEventListener("focusout", function (e) {
      if (p.open && e.relatedTarget && !p.contains(e.relatedTarget)) p.open = false;
    });
  });
  d.addEventListener("click", function (e) {
    Array.prototype.forEach.call(paineis, function (p) { if (p.open && !p.contains(e.target)) p.open = false; });
  });
})();
