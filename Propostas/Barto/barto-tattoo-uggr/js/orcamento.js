/* Estúdio Bartô Tattoo · ficha de orçamento. Melhoria progressiva: sem este arquivo a página
   continua funcionando com a caixa de mensagem livre, que vai direto ao WhatsApp.
   vbeta5: fora da /orcamento/, a ficha mora num popup (<dialog id="ficha-popup">). Todo botão de
   orçamento aponta para /orcamento/; com JavaScript o clique é interceptado e abre o popup.
   Sem JavaScript, ou num navegador sem <dialog>, o link leva à página, que funciona sozinha. */
(function () {
  var form = document.getElementById("ficha");
  if (!form) return;
  var saida = document.getElementById("mensagem-pronta");
  var texto = form.querySelector("textarea[name=text]");
  var origem = form.getAttribute("data-origem") || "orçamento";

  var tipos = {"fechamento": "fechamento", "cobertura": "cobertura", "preto-e-cinza": "preto-e-cinza", "realismo": "realismo", "colorido": "colorido", "feminino": "feminino"};  /* preenchido pelo gerador: os tipos que existem nesta versão */

  // Pré-seleção pelo endereço: ?tipo= marca o que a pessoa quer fazer, ?de= diz de onde ela veio.
  // Na /orcamento/ o endereço é o da página; no popup, o do botão que foi clicado.
  function preselecionar(busca) {
    try {
      var q = new URLSearchParams(busca);
      var t = q.get("tipo");
      if (t && tipos[t]) {
        var r = form.querySelector("input[data-campo=tipo][value='" + tipos[t] + "']");
        if (r) r.checked = true;
      }
      var de = q.get("de");
      if (de && /^[a-z0-9-]{1,40}$/.test(de)) origem = de.replace(/-/g, " ");
    } catch (e) { /* navegador antigo: segue sem pré-seleção */ }
  }
  var dlg = document.getElementById("ficha-popup");
  if (!dlg) preselecionar(window.location.search);

  function valor(campo) {
    var el = form.querySelector("[data-campo=" + campo + "]:checked") ||
             form.querySelector("select[data-campo=" + campo + "], input[type=text][data-campo=" + campo + "], textarea[data-campo=" + campo + "]");
    if (!el) return "";
    var v = (el.getAttribute("data-rotulo") || (el.tagName === "SELECT" ? el.options[el.selectedIndex].text : el.value) || "").trim();
    if (el.tagName === "SELECT" && !el.value) return "";
    return v;
  }

  function montar() {
    var linhas = ["Olá! Vim pelo site do Estúdio Bartô Tattoo (página: " + origem + ")."];
    var itens = [
      ["Quero fazer", valor("tipo")],
      ["Lugar do corpo", valor("lugar")],
      ["Tamanho aproximado", valor("tamanho")],
      ["Já tenho tatuagem no lugar", valor("existente")],
      ["A ideia", valor("ideia")],
      ["Cidade e bairro", valor("cidade")],
      ["Quando penso em fazer", valor("quando")],
      ["Meu nome", valor("nome")]
    ];
    for (var i = 0; i < itens.length; i++) {
      if (itens[i][1]) linhas.push(itens[i][0] + ": " + itens[i][1]);
    }
    linhas.push("Tenho mais de 18 anos. Vou mandar foto do local e as referências aqui na conversa.");
    return linhas.join("\n");
  }

  function atualizar() {
    var m = montar();
    if (saida) saida.textContent = m;
    if (texto) texto.value = m;
  }

  // Os campos guiados só ficam obrigatórios com JavaScript: sem ele estão escondidos,
  // e campo obrigatório escondido travaria o envio da caixa livre.
  var obrig = form.querySelectorAll("[data-obrigatorio]");
  for (var k = 0; k < obrig.length; k++) obrig[k].required = true;

  form.addEventListener("input", atualizar);
  form.addEventListener("change", atualizar);
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    atualizar();
    var fone = form.querySelector("input[name=phone]");
    var url = form.getAttribute("action") + "?" +
      (fone && fone.value ? "phone=" + encodeURIComponent(fone.value) + "&" : "") +
      "text=" + encodeURIComponent(montar());
    window.location.href = url;
  });
  atualizar();

  // ---------- o popup ----------
  if (!dlg || typeof dlg.showModal !== "function") return;
  var raiz = document.documentElement;
  var fecharBtn = dlg.querySelector(".popup-fechar");
  var titulo = document.getElementById("popup-t");
  var corpo = dlg.querySelector(".popup-corpo");
  var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gatilho = null, fechando = false, apertouFora = false;

  function ehOrcamento(a) {
    if (!a.href || a.target === "_blank" || a.hasAttribute("download")) return false;
    try {
      var u = new URL(a.href, window.location.href);
      return u.protocol === window.location.protocol && u.host === window.location.host &&
             /\/orcamento\/(index\.html)?$/.test(u.pathname);
    } catch (e) { return false; }
  }

  function abrir(a) {
    gatilho = a;
    try { preselecionar(new URL(a.href, window.location.href).search); } catch (e) {}
    atualizar();
    // trava a rolagem do fundo sem a página pular quando a barra de rolagem some
    var barra = window.innerWidth - raiz.clientWidth;
    if (barra > 0) document.body.style.paddingRight = barra + "px";
    raiz.classList.add("popup-aberto");
    dlg.classList.remove("fechando");
    dlg.showModal();
    if (corpo) corpo.scrollTop = 0;
    if (titulo) titulo.focus({ preventScroll: true });
  }

  function fechar() {
    if (!dlg.open || fechando) return;
    if (calmo) { dlg.close(); return; }
    fechando = true;
    dlg.classList.add("fechando");
    var feito = false;
    function fim() { if (feito) return; feito = true; dlg.close(); }
    dlg.addEventListener("animationend", fim, { once: true });
    setTimeout(fim, 320);
  }

  // Tudo que fechar o popup (X, Esc, clique fora, ou o próprio navegador) passa por aqui.
  dlg.addEventListener("close", function () {
    fechando = false;
    dlg.classList.remove("fechando");
    raiz.classList.remove("popup-aberto");
    document.body.style.paddingRight = "";
    if (gatilho && document.contains(gatilho)) gatilho.focus({ preventScroll: true });
    gatilho = null;
  });

  // Esc: o navegador dispara "cancel"; seguramos para a saída animada.
  dlg.addEventListener("cancel", function (ev) { ev.preventDefault(); fechar(); });
  if (fecharBtn) fecharBtn.addEventListener("click", fechar);

  // Clique fora: o fundo escurecido é o próprio <dialog>. Só fecha se o toque começou e terminou fora,
  // para não fechar quando alguém arrasta para selecionar texto num campo.
  dlg.addEventListener("pointerdown", function (ev) { apertouFora = ev.target === dlg; });
  dlg.addEventListener("click", function (ev) {
    if (ev.target === dlg && apertouFora) fechar();
    apertouFora = false;
  });

  // Foco preso: Tab no último volta ao primeiro, e Shift+Tab no primeiro vai ao último.
  dlg.addEventListener("keydown", function (ev) {
    if (ev.key !== "Tab") return;
    var els = dlg.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select, textarea, [tabindex]:not([tabindex='-1'])");
    var vis = [];
    for (var i = 0; i < els.length; i++) if (els[i].offsetWidth || els[i].offsetHeight || els[i].getClientRects().length) vis.push(els[i]);
    if (!vis.length) return;
    var prim = vis[0], ult = vis[vis.length - 1], at = document.activeElement;
    if (ev.shiftKey && (at === prim || at === titulo || at === dlg)) { ev.preventDefault(); ult.focus(); }
    else if (!ev.shiftKey && at === ult) { ev.preventDefault(); prim.focus(); }
  });

  // Todo botão de orçamento abre o popup. Ctrl/Cmd/Shift ou botão do meio seguem abrindo a página.
  document.addEventListener("click", function (ev) {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var a = ev.target.closest ? ev.target.closest("a") : null;
    if (!a || dlg.contains(a) || !ehOrcamento(a)) return;
    ev.preventDefault();
    var menu = a.closest("details.menu");
    if (menu) menu.open = false;  // fecha o menu do celular, se o clique veio dele
    abrir(a);
  });
})();
