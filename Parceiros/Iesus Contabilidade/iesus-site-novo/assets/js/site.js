/* IESUS Contabilidade, site.js, sem dependencias (vbeta5: "Luz por tras" nas cores e fontes da marca, com rolagem por inercia) */
(function () {
  "use strict";
  var WA = "556282041641";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temIO = "IntersectionObserver" in window;

  /* menu no celular */
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      btn.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("aberto")) {
        nav.classList.remove("aberto");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  /* "Ver mais segmentos": o details abre sozinho, sem JS e pelo teclado; aqui so espelhamos o estado em aria-expanded */
  var mais = document.querySelectorAll("details.sumario-mais");
  for (var m = 0; m < mais.length; m++) {
    (function (d) {
      var s = d.querySelector("summary");
      if (!s) return;
      function espelha() { s.setAttribute("aria-expanded", d.open ? "true" : "false"); }
      espelha();
      d.addEventListener("toggle", espelha);
    })(mais[m]);
  }

  /* a luz se acende quando o bloco entra na tela */
  var luzes = document.querySelectorAll("[data-luz]");
  function acenderTudo() { for (var i = 0; i < luzes.length; i++) luzes[i].classList.add("acesa"); }
  if (!temIO || reduz) {
    acenderTudo();
  } else {
    var io = new IntersectionObserver(function (itens) {
      for (var i = 0; i < itens.length; i++) {
        if (itens[i].isIntersecting) { itens[i].target.classList.add("acesa"); io.unobserve(itens[i].target); }
      }
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    for (var l = 0; l < luzes.length; l++) io.observe(luzes[l]);
  }

  /* rolagem: capa, cena, cabecalho e o botao flutuante, num quadro so */
  var capa = document.querySelector("[data-capa]");
  var cena = document.querySelector("[data-cena]");
  var hdr = document.querySelector(".hdr");
  var wa = document.querySelector(".wa-float");
  var pedido = false;
  function lim(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
  function quadro() {
    pedido = false;
    var y = window.pageYOffset || doc.scrollTop || 0;
    var vh = window.innerHeight || doc.clientHeight;
    if (hdr) hdr.classList.toggle("rolou", y > 40);
    if (capa) {
      var hc = capa.offsetHeight || 1;
      if (!reduz) capa.style.setProperty("--s", lim(y / hc).toFixed(3));
      if (wa) wa.classList.toggle("visivel", y > hc * 0.6);
    }
    if (cena && !reduz) {
      var r = cena.getBoundingClientRect();
      var p;
      if (window.innerWidth >= 700) p = -r.top / Math.max(1, r.height - vh);
      else p = (vh * 0.85 - r.top) / Math.max(1, r.height * 0.9);
      cena.style.setProperty("--p", lim(p).toFixed(3));
    }
  }
  function pedir() { if (!pedido) { pedido = true; window.requestAnimationFrame(quadro); } }
  if (!capa && wa) wa.classList.add("visivel");
  if (capa || cena || hdr) {
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    quadro();
  }

  /* rolagem com inercia (vbeta5, Gabriel 10/11): so roda de mouse e trackpad em tela com ponteiro fino;
     no toque o celular ja tem a inercia dele, e com movimento reduzido fica a rolagem do sistema.
     A pagina continua rolando de verdade (scrollTo a cada quadro): sticky, ancora, teclado e barra seguem nativos. */
  var finoComHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!reduz && finoComHover && window.requestAnimationFrame) {
    var alvo = window.pageYOffset || 0, atual = alvo, rodando = false, ultimo = 0;
    var RAPIDEZ = 7; /* quanto maior, mais curta a cauda; 7 por segundo ~ lerp 0,11 a 60 quadros */
    function maxY() { return Math.max(0, (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight); }
    function rolavelDentro(el) {
      while (el && el !== document.body && el !== doc) {
        if (el.nodeType === 1) {
          var st = window.getComputedStyle(el), oy = st.overflowY;
          if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
        }
        el = el.parentNode;
      }
      return false;
    }
    function passo(t) {
      if (!rodando) return;
      var dt = ultimo ? Math.min(0.05, (t - ultimo) / 1000) : 1 / 60;
      ultimo = t;
      atual += (alvo - atual) * (1 - Math.exp(-RAPIDEZ * dt));
      if (Math.abs(alvo - atual) < 0.5) atual = alvo;
      window.scrollTo(0, atual);
      if (atual !== alvo) { window.requestAnimationFrame(passo); }
      else { rodando = false; ultimo = 0; }
    }
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.defaultPrevented) return;                 /* zoom do navegador */
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;          /* gesto lateral */
      if (nav && nav.classList.contains("aberto")) return;
      if (rolavelDentro(e.target)) return;                          /* caixa com rolagem propria */
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= window.innerHeight;
      e.preventDefault();
      if (!rodando) { atual = window.pageYOffset || 0; alvo = atual; }
      alvo = Math.max(0, Math.min(maxY(), alvo + d));
      if (!rodando) { rodando = true; window.requestAnimationFrame(passo); }
    }, { passive: false });
    /* teclado, barra, ancora ou busca na pagina: a rolagem nativa manda e a inercia se realinha */
    function parar() { rodando = false; ultimo = 0; alvo = atual = window.pageYOffset || 0; }
    window.addEventListener("scroll", function () { if (!rodando) { atual = alvo = window.pageYOffset || 0; } }, { passive: true });
    window.addEventListener("keydown", parar);
    window.addEventListener("mousedown", parar);
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (a) parar();
    }, true);
    window.addEventListener("resize", function () { alvo = Math.min(alvo, maxY()); });
  }

  /* um video por vez */
  var videos = document.querySelectorAll("video");
  for (var v = 0; v < videos.length; v++) {
    videos[v].addEventListener("play", function (e) {
      for (var k = 0; k < videos.length; k++) if (videos[k] !== e.target) videos[k].pause();
    });
  }

  /* players: capa com o botao e a duracao, o video so carrega no clique */
  var players = document.querySelectorAll("[data-player]");
  for (var pl = 0; pl < players.length; pl++) {
    (function (fig) {
      var video = fig.querySelector("video");
      var capaBtn = fig.querySelector(".pl-capa");
      if (!video || !capaBtn) return;
      capaBtn.hidden = false;
      video.removeAttribute("controls");
      capaBtn.addEventListener("click", function () {
        video.setAttribute("controls", "");
        capaBtn.hidden = true;
        fig.classList.add("tocando");
        var t = video.play();
        if (t && t.catch) t.catch(function () {});
        video.focus();
      });
    })(players[pl]);
  }

  /* guia: as pastas viram abas */
  var guias = document.querySelectorAll("[data-guia]");
  for (var g = 0; g < guias.length; g++) {
    (function (guia) {
      var lista = guia.querySelector("[role=tablist]");
      if (!lista) return;
      var abas = lista.querySelectorAll("[role=tab]");
      var paineis = [];
      for (var i = 0; i < abas.length; i++) paineis.push(document.getElementById(abas[i].getAttribute("aria-controls")));
      lista.hidden = false;
      guia.classList.add("com-abas");
      function escolher(n, focar) {
        for (var i = 0; i < abas.length; i++) {
          var sim = i === n;
          abas[i].setAttribute("aria-selected", sim ? "true" : "false");
          abas[i].tabIndex = sim ? 0 : -1;
          if (paineis[i]) paineis[i].hidden = !sim;
        }
        if (focar) abas[n].focus();
      }
      var inicial = 0;
      for (var a = 0; a < abas.length; a++) {
        if (paineis[a]) { paineis[a].setAttribute("role", "tabpanel"); paineis[a].setAttribute("aria-labelledby", abas[a].id); paineis[a].tabIndex = 0; }
        if (abas[a].getAttribute("aria-selected") === "true") inicial = a;
        (function (n) {
          abas[n].addEventListener("click", function () { escolher(n, false); });
          abas[n].addEventListener("keydown", function (e) {
            var alvo = null;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") alvo = (n + 1) % abas.length;
            else if (e.key === "ArrowLeft" || e.key === "ArrowUp") alvo = (n - 1 + abas.length) % abas.length;
            else if (e.key === "Home") alvo = 0;
            else if (e.key === "End") alvo = abas.length - 1;
            if (alvo !== null) { e.preventDefault(); escolher(alvo, true); }
          });
        })(a);
      }
      escolher(inicial, false);
    })(guias[g]);
  }

  /* a conta da CBS: muda o credito e ve o que sobra */
  var contas = document.querySelectorAll("[data-conta]");
  function reais(n) { return "R$ " + Math.round(n).toLocaleString("pt-BR"); }
  for (var c = 0; c < contas.length; c++) {
    (function (conta) {
      var debito = parseFloat(conta.getAttribute("data-debito")) || 1000;
      var ctl = conta.querySelector(".conta-ctl");
      var faixa = conta.querySelector("input[type=range]");
      if (!ctl || !faixa) return;
      ctl.hidden = false;
      var vCred = conta.querySelector("[data-v=cred]");
      var vRes = conta.querySelector("[data-v=res]");
      var bCred = conta.querySelector(".cl-cred .cl-barra i");
      var bRes = conta.querySelector(".cl-res .cl-barra i");
      function atualizar() {
        var cred = Math.min(debito, Math.max(0, parseFloat(faixa.value) || 0));
        var res = Math.max(0, debito - cred);
        if (vCred) vCred.textContent = "− " + reais(cred);
        if (vRes) vRes.textContent = reais(res);
        if (bCred) bCred.style.setProperty("--w", (cred / debito).toFixed(3));
        if (bRes) bRes.style.setProperty("--w", (res / debito).toFixed(3));
        faixa.setAttribute("aria-valuetext", reais(cred) + " de crédito");
      }
      faixa.addEventListener("input", atualizar);
      atualizar();
    })(contas[c]);
  }

  /* sinais de que e hora de trocar: a lista marcada vai junto na mensagem */
  var sinais = document.querySelectorAll("[data-sinais]");
  for (var s = 0; s < sinais.length; s++) {
    (function (bloco) {
      var envio = bloco.querySelector("[data-sinais-envio]");
      if (!envio) return;
      var msg = bloco.getAttribute("data-msg") || "";
      var vazia = bloco.getAttribute("data-msg-vazia") || msg;
      function montar() {
        var marcados = bloco.querySelectorAll("input[name=sinal]:checked");
        var partes = [];
        for (var i = 0; i < marcados.length; i++) partes.push(marcados[i].value);
        var texto = partes.length ? msg + " " + partes.join(" ") : vazia;
        envio.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(texto);
      }
      bloco.addEventListener("change", montar);
      montar();
    })(sinais[s]);
  }

  /* consentimento (Consent Mode v2: tudo negado ate o aceite) */
  var CHAVE = "iesus-consentimento";
  var caixa = document.getElementById("consent");
  function ler() { try { return window.localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(valor) { try { window.localStorage.setItem(CHAVE, valor); } catch (e) { /* sem armazenamento: pergunta de novo na proxima visita */ } }
  function aplicar(valor) {
    if (typeof window.gtag !== "function") return;
    var gg = valor === "aceito" ? "granted" : "denied";
    window.gtag("consent", "update", { ad_storage: gg, ad_user_data: gg, ad_personalization: gg, analytics_storage: gg });
  }
  function abrir() { if (caixa) { caixa.classList.add("aberto"); document.body.classList.add("com-consent"); } }
  if (caixa) {
    var atual = ler();
    if (atual) { aplicar(atual); } else { abrir(); }
    caixa.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b) return;
      var valor = b.getAttribute("data-consent");
      gravar(valor); aplicar(valor);
      caixa.classList.remove("aberto"); document.body.classList.remove("com-consent");
    });
  }
  var reabrir = document.querySelectorAll("[data-reabrir-consent]");
  for (var rr = 0; rr < reabrir.length; rr++) {
    reabrir[rr].addEventListener("click", function (e) { e.preventDefault(); abrir(); });
  }

  /* formulario: monta a mensagem e abre o WhatsApp; nada e guardado */
  var form = document.getElementById("form-diagnostico");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var tel = form.whatsapp.value.trim();
      var marcado = form.querySelector("input[name=assunto]:checked");
      var extra = form.mensagem ? form.mensagem.value.trim() : "";
      var erro = form.querySelector(".erro");
      var telOk = tel.replace(/\D/g, "").length >= 10;
      var faltas = [];
      if (!nome) faltas.push("seu nome");
      if (!telOk) faltas.push("um WhatsApp com DDD");
      if (!marcado) faltas.push("o que você precisa");
      if (faltas.length) {
        erro.textContent = "Falta preencher " + faltas.join(", ") + ".";
        erro.hidden = false;
        var primeiro = !nome ? form.nome : (!telOk ? form.whatsapp : form.querySelector("input[name=assunto]"));
        primeiro.focus();
        return;
      }
      erro.hidden = true;
      var texto = "Olá, sou " + nome + ". Quero um diagnóstico da IESUS sobre: " + marcado.value + ".";
      if (extra) texto += " " + extra;
      texto += " Meu WhatsApp: " + tel + ".";
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    });
  }
})();
