/* Calculadora do cliente novo, ZX Digital (vbeta2, 17/10/2026).
 *
 * A conta roda inteira no navegador e nao grava nada (sem cookie, sem localStorage).
 * Saidas de dado, as duas por acao da pessoa:
 *   1. o botao de WhatsApp;
 *   2. o pedido do PDF: o formulario do popup manda nome, WhatsApp, empresa, os aceites
 *      e os numeros da conta para o Apps Script da ZX (ENDPOINT), que grava numa planilha
 *      Google e avisa o Gabriel por e-mail. E' a unica requisicao de rede do arquivo.
 * O PDF e' montado no proprio aparelho pelo jsPDF 2.5.1, servido do nosso dominio.
 *
 * Arquivo externo de proposito: a politica de seguranca prevista para o site
 * (19-cabecalhos-no-cloudflare.md) libera script do proprio dominio ('self') e
 * barraria script embutido sem hash. Sem onclick no HTML pelo mesmo motivo.
 */
(function (raiz) {
  "use strict";

  var WHATSAPP = "5562993116017";
  // Link do app da web do Apps Script (Implantar > Nova implantacao > App da Web). Enquanto
  // nao for um link https://script.google.com/macros/s/.../exec, o PDF baixa mas nada e'
  // enviado, e o build_calculadora.py recusa montar o pacote que sobe.
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbxXD3sKlt9HQjrGa2CpBIbRibkGnmGv7V-aI1Yb6klq0-pRKTLOgUVCABgTtRnk0MW9tw/exec";

  /* ---------- leitura de numero digitado do jeito brasileiro ---------- */
  // "1.500" -> 1500 · "1.500,50" -> 1500.5 · "7,46" -> 7.46 · "7.46" -> 7.46 · "R$ 970" -> 970
  function lerNumero(txt) {
    if (txt === null || txt === undefined) return NaN;
    var s = String(txt).replace(/r\$/i, "").replace(/\s/g, "").replace(/ /g, "");
    if (s === "") return NaN;
    if (s.indexOf(",") >= 0) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
      s = s.replace(/\./g, "");
    }
    if (!/^\d+(\.\d+)?$/.test(s)) return NaN;
    return parseFloat(s);
  }

  /* ---------- formatos ---------- */
  function arred(n, casas) {
    var f = Math.pow(10, casas);
    return Math.round((n + Number.EPSILON) * f) / f;
  }
  function milhar(intStr) {
    return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  // R$ 125 (inteiro) · R$ 7,46 (com centavos) · R$ 1.500
  function reais(n) {
    var v = arred(n, 2);
    var inteiro = Math.floor(v);
    var cent = Math.round((v - inteiro) * 100);
    var txt = "R$ " + milhar(String(inteiro));
    if (cent > 0) txt += "," + (cent < 10 ? "0" : "") + cent;
    return txt;
  }
  // 4,8 · 8 · 1,4
  function decimal1(n) {
    var v = arred(n, 1);
    var s = String(v).replace(".", ",");
    return s;
  }
  function vezesTxt(n) {
    var v = arred(n, 1);
    return decimal1(v) + (v === 1 ? " vez" : " vezes");
  }
  function plural(n, um, varios) { return n === 1 ? um : varios; }

  /* ---------- a conta ---------- */
  // d = {gasto, chamaram, fecharam, ticket, voltas} (numeros; ticket e voltas podem ser NaN)
  // devolve {ok, erros[], blocos[], mensagem}
  function calcular(d) {
    var erros = [];
    var g = d.gasto, c = d.chamaram, f = d.fecharam, t = d.ticket, v = d.voltas;

    if (!(g > 0)) erros.push({ campo: "gasto", txt: "Digite quanto foi gasto no mês para atrair contatos. Sem gasto, não há custo para dividir." });
    if (!(c > 0)) erros.push({ campo: "chamaram", txt: "Digite quantas pessoas chamaram. Se ninguém chamou, a conta ainda não tem o que dividir." });
    else if (Math.floor(c) !== c) erros.push({ campo: "chamaram", txt: "Use um número inteiro de pessoas." });
    if (isNaN(f) || f < 0) erros.push({ campo: "fecharam", txt: "Digite quantas pessoas fecharam e pagaram. Se ninguém fechou, digite 0." });
    else if (Math.floor(f) !== f) erros.push({ campo: "fecharam", txt: "Use um número inteiro de clientes." });
    else if (c > 0 && f > c) erros.push({ campo: "fecharam", txt: "Quem fechou não pode passar de quem chamou. Confira se os dois números são do mesmo mês e da mesma origem." });
    if (!isNaN(t) && t <= 0) erros.push({ campo: "ticket", txt: "O valor da primeira compra precisa ser maior que zero, ou deixe o campo vazio." });
    if (!isNaN(v) && (v < 0 || Math.floor(v) !== v)) erros.push({ campo: "voltas", txt: "Use um número inteiro de vezes, a partir de 0." });
    if (erros.length) return { ok: false, erros: erros, blocos: [], mensagem: mensagemWhatsApp(null) };

    var temTicket = !isNaN(t);
    var temVoltas = !isNaN(v);
    var r = {
      custoChamada: g / c,
      custoCliente: f > 0 ? g / f : null,
      emCada: f > 0 ? c / f : null,
      taxa: f / c
    };
    var blocos = [];

    // 1. cada pessoa que chamou
    blocos.push({
      id: "chamada",
      titulo: "Cada pessoa que chamou custou " + reais(r.custoChamada),
      texto: reais(g) + " divididos por " + milhar(String(c)) + " " + plural(c, "pessoa", "pessoas") +
        ". Esse número diz se o anúncio está trazendo contatos a um preço razoável, mas ainda não diz quanto custa um cliente, porque chamar não é comprar."
    });

    // 2. cada cliente novo
    if (f === 0) {
      blocos.push({
        id: "cliente",
        titulo: "Ninguém fechou neste mês",
        texto: "Por isso ainda não existe custo por cliente para calcular: todo o gasto ficou nas conversas que não viraram venda. Quando isso acontece, a perda está entre a primeira mensagem e o fechamento, e é ali que vale olhar primeiro."
      });
    } else {
      var k = r.emCada;
      var kInt = Math.abs(k - Math.round(k)) < 0.05;
      var emCadaTxt = (kInt ? "" : "cerca de ") + "1 em cada " + milhar(String(Math.round(k)));
      var fraseCada = k <= 1.05
        ? "Todas as pessoas que chamaram fecharam, então o custo de cada cliente é o mesmo de cada conversa."
        : milhar(String(f)) + " das " + milhar(String(c)) + " pessoas fecharam, " + emCadaTxt +
          ". Por isso o custo de cada cliente é " + vezesTxt(k) + " o de cada conversa.";
      blocos.push({
        id: "cliente",
        titulo: "Cada cliente novo custou " + reais(r.custoCliente),
        texto: reais(g) + " divididos por " + milhar(String(f)) + " " + plural(f, "cliente", "clientes") + ". " + fraseCada
      });
    }

    // 3. a primeira compra paga o cliente?
    if (f > 0) {
      if (!temTicket) {
        blocos.push({
          id: "primeira",
          titulo: "Falta o valor da primeira compra",
          texto: "Preencha quanto um cliente paga na primeira compra para ver se ela cobre os " + reais(r.custoCliente) + " que custou trazer cada um."
        });
      } else {
        var dif = t - r.custoCliente;
        if (dif < -0.005) {
          var falta = -dif;
          var voltasNec = Math.ceil(arred(falta / t, 6));
          var txt = "A primeira compra, de " + reais(t) + ", não cobre o que custou trazer este cliente, e faltam " + reais(falta) +
            ". A empresa está pagando para crescer, e só recupera esse valor se o cliente voltar a comprar: com o mesmo valor, ele precisa voltar " +
            milhar(String(voltasNec)) + " " + plural(voltasNec, "vez", "vezes") + " para fechar a diferença.";
          blocos.push({ id: "primeira", titulo: "A primeira compra não paga o cliente", texto: txt, tom: "alerta" });
        } else {
          var sobra = Math.max(dif, 0);
          blocos.push({
            id: "primeira",
            titulo: "A primeira compra já paga o cliente",
            texto: "Ela é de " + reais(t) + " e o cliente custou " + reais(r.custoCliente) +
              (sobra > 0.005 ? ", então sobram " + reais(sobra) + "." : ", então ela empata com o custo.") +
              " Lembre que os " + reais(t) + " são o que ele paga, não o lucro: deles ainda sai o custo de fazer o serviço."
          });
        }
      }
    }

    // 4. quanto vale um cliente que volta
    if (f > 0 && temTicket) {
      if (!temVoltas) {
        blocos.push({
          id: "ano",
          titulo: "Falta quantas vezes o cliente volta",
          texto: "Preencha quantas vezes por ano um cliente costuma voltar depois da primeira compra para ver quanto ele deixa no ano."
        });
      } else if (v === 0) {
        blocos.push({
          id: "ano",
          titulo: "Sem volta, a primeira compra é tudo",
          texto: "Se o cliente não volta, os " + reais(t) + " da primeira compra são tudo o que ele deixa. Por isso, numa empresa em que quase ninguém volta, o custo de trazer cada cliente pesa mais, e fazer o cliente voltar vale tanto quanto trazer um novo."
        });
      } else {
        var ano = t * (1 + v);
        var mult = ano / r.custoCliente;
        var base = "Com a primeira compra e mais " + milhar(String(v)) + " " + plural(v, "volta", "voltas") +
          ", cada cliente deixa " + reais(ano) + " no ano";
        var fim;
        if (ano + 0.005 < r.custoCliente) {
          fim = ", menos do que custou trazê-lo. Mesmo voltando, a conta não fecha no primeiro ano.";
        } else if (t + 0.005 < r.custoCliente) {
          fim = ", " + vezesTxt(mult) + " o que custou trazê-lo. Aqui é a volta que paga a conta, e um cliente que não volta vira prejuízo.";
        } else {
          fim = ", " + vezesTxt(mult) + " o que custou trazê-lo.";
        }
        blocos.push({ id: "ano", titulo: "Um cliente que volta deixa " + reais(ano) + " no ano", texto: base + fim, valorAno: ano });
      }
    }

    // a leitura: o que olhar primeiro
    var leitura = null;
    if (f > 0) {
      var poucos = r.taxa < 0.1;
      var partes = [];
      if (temTicket && temVoltas && t * (1 + v) + 0.005 < r.custoCliente) {
        partes.push("O custo de trazer cada cliente está acima do que ele deixa no ano. Antes de pôr mais dinheiro em anúncio, vale entender por que as pessoas que chamaram não fecharam e o que faria o cliente voltar.");
      } else if (temTicket && t + 0.005 < r.custoCliente) {
        partes.push("A conta só fecha com a volta do cliente, por isso o que acontece depois da primeira compra merece tanto cuidado quanto o anúncio.");
      } else if (temTicket) {
        partes.push("A conta fecha já na primeira compra. A pergunta passa a ser quantas das pessoas que chamaram ficaram sem fechar, porque cada uma delas já custou " + reais(r.custoChamada) + ".");
      }
      if (poucos) {
        partes.push("Como só " + (r.emCada ? ("1 em cada " + milhar(String(Math.round(r.emCada)))) : "uma parte pequena") + " fechou, vale olhar o atendimento antes do anúncio: o que se responde, em quanto tempo, e se alguém retoma quem sumiu.");
      }
      if (partes.length) leitura = partes.join(" ");
    }

    return { ok: true, erros: [], resultado: r, blocos: blocos, leitura: leitura, mensagem: mensagemWhatsApp({ r: r, t: temTicket ? t : null }) };
  }

  /* ---------- a mensagem pronta do WhatsApp ---------- */
  // Leva o resultado para a conversa comecar do numero da pessoa. A pagina avisa
  // ao lado do botao, e a pessoa pode apagar antes de enviar.
  function mensagemWhatsApp(info) {
    var m = "Olá! Fiz a conta na calculadora da ZX";
    if (info && info.r && info.r.custoCliente) {
      m += ": cada cliente novo saiu " + reais(info.r.custoCliente);
      if (info.t) m += " e a primeira compra é de " + reais(info.t);
    }
    m += ". Quero o diagnóstico gratuito da minha empresa.";
    return m.replace(/ /g, " ");
  }
  function linkWhatsApp(msg) {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  }

  var api = { lerNumero: lerNumero, reais: reais, calcular: calcular, mensagemWhatsApp: mensagemWhatsApp, linkWhatsApp: linkWhatsApp };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  /* ---------- a pagina ---------- */
  var CAMPOS = ["gasto", "chamaram", "fecharam", "ticket", "voltas"];
  var EXEMPLO = { gasto: "1.500", chamaram: "60", fecharam: "12", ticket: "50", voltas: "11" };

  function el(id) { return document.getElementById(id); }

  function lerForm() {
    var d = {};
    CAMPOS.forEach(function (k) { d[k] = lerNumero(el("c-" + k).value); });
    return d;
  }

  function limparErros() {
    CAMPOS.forEach(function (k) {
      var e = el("e-" + k);
      e.textContent = "";
      e.hidden = true;
      el("c-" + k).removeAttribute("aria-invalid");
    });
  }

  function mostrar(res, focarResultado) {
    limparErros();
    var caixa = el("resultado");
    var lista = el("resultado-blocos");
    var leitura = el("resultado-leitura");
    var botao = el("whats");
    botao.href = linkWhatsApp(res.mensagem);
    if (!res.ok) {
      res.erros.forEach(function (er, i) {
        var e = el("e-" + er.campo);
        if (!e.textContent) { e.textContent = er.txt; e.hidden = false; }
        el("c-" + er.campo).setAttribute("aria-invalid", "true");
        if (i === 0 && focarResultado) el("c-" + er.campo).focus();
      });
      return;
    }
    lista.textContent = "";
    res.blocos.forEach(function (b) {
      var art = document.createElement("article");
      art.className = "res-bloco" + (b.tom === "alerta" ? " alerta" : "");
      var h = document.createElement("h3");
      h.textContent = b.titulo;
      var p = document.createElement("p");
      p.textContent = b.texto;
      art.appendChild(h);
      art.appendChild(p);
      lista.appendChild(art);
    });
    if (res.leitura) {
      leitura.hidden = false;
      el("resultado-leitura-txt").textContent = res.leitura;
    } else {
      leitura.hidden = true;
    }
    caixa.hidden = false;
    el("whats-aviso").hidden = false;
    if (focarResultado) {
      el("resultado-titulo").focus({ preventScroll: true });
      caixa.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }


  /* ---------- painel: numeros grandes e os dois graficos ---------- */
  var NS = "http://www.w3.org/2000/svg";
  var COR = { tinta: "#17191C", sinal: "#F28C27", ouro: "#F3C353", brasa: "#94520E", papel: "#F3E7DA", fraco: "#5A5750", branco: "#F8F7F4", linha: "#C9C6BE" };

  function svgEl(nome, attrs, texto) {
    var e = document.createElementNS(NS, nome);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  // os numeros que o painel e o PDF usam, tirados da mesma conta
  function resumo(res, d) {
    var r = res.resultado;
    var temT = !isNaN(d.ticket), temV = !isNaN(d.voltas);
    var z = {
      gasto: d.gasto, chamaram: d.chamaram, fecharam: d.fecharam,
      ticket: temT ? d.ticket : null, voltas: temV ? d.voltas : null,
      custoContato: r.custoChamada, custoCliente: r.custoCliente,
      de100: r.taxa * 100,
      primeira: temT && d.fecharam > 0 ? d.fecharam * d.ticket : null,
      ano: temT && temV && d.fecharam > 0 ? d.fecharam * d.ticket * (1 + d.voltas) : null,
      clienteAno: temT && temV ? d.ticket * (1 + d.voltas) : null
    };
    z.multAno = z.clienteAno && r.custoCliente ? z.clienteAno / r.custoCliente : null;
    return z;
  }

  function de100Txt(x) {
    if (x > 0 && x < 1) return "menos de 1";
    return milhar(String(Math.round(x)));
  }

  function cartoes(z) {
    var c = [];
    c.push({ rot: "Cada contato", val: reais(z.custoContato), sub: "o que custou cada pessoa que chamou" });
    if (z.fecharam > 0) c.push({ rot: "Cada cliente novo", val: reais(z.custoCliente), sub: "o que custou cada pessoa que comprou", tom: "destaque" });
    else c.push({ rot: "Cada cliente novo", val: "Ninguém fechou", sub: "todo o gasto ficou nas conversas", tom: "destaque" });
    c.push({ rot: "Fecharam", val: de100Txt(z.de100) + " de 100", sub: "de cada 100 pessoas que chamaram" });
    if (z.clienteAno !== null && z.fecharam > 0) {
      c.push({ rot: "Um cliente no ano", val: reais(z.clienteAno), sub: vezesTxt(z.multAno) + " o custo dele",
        tom: z.clienteAno + 0.005 < z.custoCliente ? "alerta" : "" });
    } else if (z.ticket !== null && z.fecharam > 0) {
      c.push({ rot: "Primeira compra", val: reais(z.ticket), sub: "preencha as voltas para ver o ano" });
    } else {
      c.push({ rot: "Um cliente no ano", val: "Falta a compra", sub: "preencha o valor da primeira compra" });
    }
    return c;
  }

  // do contato ao cliente: barra cheia de quem chamou, a perda no meio, a barra de quem fechou
  function graficoCaminho(z) {
    var W = 600, H = 236;
    var s = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": z.chamaram + " pessoas chamaram e " + z.fecharam + " fecharam" });
    var w2 = z.fecharam > 0 ? Math.max(W * z.fecharam / z.chamaram, 210) : 210;
    var x2 = (W - w2) / 2, perdidos = z.chamaram - z.fecharam;
    var txt = function (x, y, cor, peso, tam, t) {
      return svgEl("text", { x: x, y: y, "text-anchor": "middle", fill: cor, "font-family": "Sora,sans-serif", "font-weight": peso, "font-size": tam }, t);
    };
    s.appendChild(svgEl("rect", { x: 0, y: 0, width: W, height: 78, rx: 12, fill: COR.tinta }));
    s.appendChild(txt(W / 2, 36, COR.branco, 800, 26, milhar(String(z.chamaram)) + " " + plural(z.chamaram, "pessoa chamou", "pessoas chamaram")));
    s.appendChild(txt(W / 2, 62, COR.ouro, 600, 18, reais(z.custoContato) + " cada"));
    s.appendChild(svgEl("path", { d: "M8 82 L" + (W - 8) + " 82 L" + (x2 + w2 - 4) + " 150 L" + (x2 + 4) + " 150 Z", fill: COR.papel }));
    s.appendChild(txt(W / 2, 122, COR.brasa, 600, 17,
      perdidos > 0 ? milhar(String(perdidos)) + " " + plural(perdidos, "não fechou", "não fecharam") : "Todas fecharam"));
    s.appendChild(svgEl("rect", { x: x2, y: 154, width: w2, height: 78, rx: 12, fill: z.fecharam > 0 ? COR.sinal : COR.linha }));
    s.appendChild(txt(W / 2, 190, COR.tinta, 800, 26,
      z.fecharam > 0 ? milhar(String(z.fecharam)) + " " + plural(z.fecharam, "fechou", "fecharam") : "Ninguém fechou"));
    if (z.fecharam > 0) s.appendChild(txt(W / 2, 216, COR.tinta, 600, 18, reais(z.custoCliente) + " cada"));
    return s;
  }

  function barras(z) {
    var lin = [{ rot: "Gasto no mês", v: z.gasto, cor: COR.tinta }];
    if (z.primeira !== null) lin.push({ rot: "Voltou na primeira compra", v: z.primeira, cor: COR.sinal });
    if (z.ano !== null) lin.push({ rot: "Volta no ano com esses clientes", v: z.ano, cor: COR.ouro });
    return lin;
  }

  function graficoDinheiro(z) {
    var lin = barras(z), W = 600, passo = 66, H = lin.length * passo;
    var max = Math.max.apply(null, lin.map(function (l) { return l.v; }));
    var s = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": lin.map(function (l) { return l.rot + ": " + reais(l.v); }).join("; ") });
    lin.forEach(function (l, i) {
      var y = i * passo;
      s.appendChild(svgEl("text", { x: 0, y: y + 20, fill: COR.tinta, "font-family": "Sora,sans-serif", "font-weight": 600, "font-size": 18 }, l.rot));
      s.appendChild(svgEl("text", { x: W, y: y + 20, "text-anchor": "end", fill: COR.tinta, "font-family": "Sora,sans-serif", "font-weight": 800, "font-size": 18 }, reais(l.v)));
      s.appendChild(svgEl("rect", { x: 0, y: y + 30, width: W, height: 22, rx: 11, fill: "#ECE9E2" }));
      s.appendChild(svgEl("rect", { x: 0, y: y + 30, width: Math.max(W * l.v / max, 22), height: 22, rx: 11, fill: l.cor }));
    });
    return s;
  }

  function desenharPainel(z) {
    var k = el("kpis");
    k.textContent = "";
    cartoes(z).forEach(function (c) {
      var d = document.createElement("div");
      d.className = "kpi" + (c.tom ? " " + c.tom : "");
      [["rot", c.rot], ["val", c.val], ["sub", c.sub]].forEach(function (p) {
        var e = document.createElement("p");
        e.className = p[0];
        e.textContent = p[1];
        d.appendChild(e);
      });
      k.appendChild(d);
    });
    var cam = el("caminho");
    cam.textContent = "";
    cam.appendChild(graficoCaminho(z));
    var din = el("dinheiro"), gd = el("graf-dinheiro");
    din.textContent = "";
    if (z.primeira === null) { gd.hidden = true; return; }
    gd.hidden = false;
    din.appendChild(graficoDinheiro(z));
    var n = document.createElement("p");
    n.className = "nota";
    n.textContent = "Valores do que os clientes pagam, e não do lucro.";
    din.appendChild(n);
  }

  /* ---------- o PDF, montado no aparelho ---------- */
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  function hojeTxt() { var h = new Date(); return h.getDate() + " de " + MESES[h.getMonth()] + " de " + h.getFullYear(); }
  function rgb(hex) { return [parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)]; }

  function montarPDF(res, z, lead) {
    var J = raiz.jspdf && raiz.jspdf.jsPDF;
    if (!J) throw new Error("jsPDF nao carregou");
    var doc = new J({ unit: "mm", format: "a4" });
    var M = 16, L = 210 - 2 * M, y;
    function cor(hex, tipo) {
      var c = rgb(hex);
      if (tipo === "f") doc.setFillColor(c[0], c[1], c[2]);
      else if (tipo === "d") doc.setDrawColor(c[0], c[1], c[2]);
      else doc.setTextColor(c[0], c[1], c[2]);
    }
    function fonte(peso, tam) { doc.setFont("helvetica", peso); doc.setFontSize(tam); }
    function rodape() {
      fonte("normal", 7.5); cor(COR.fraco);
      doc.text("zetaxdigital.com.br/calculadora  ·  Estimativa feita com os números informados, não é garantia de resultado.", M, 289);
    }
    function cabe(alt) { if (y + alt > 278) { rodape(); doc.addPage(); y = 18; } }

    // cabecalho
    cor(COR.tinta, "f"); doc.rect(0, 0, 210, 44, "F");
    fonte("bold", 8); cor(COR.sinal); doc.text("CALCULADORA DO CLIENTE NOVO  ·  ZX DIGITAL", M, 14);
    fonte("bold", 18); cor(COR.branco); doc.text("Quanto custa um cliente novo na sua empresa", M, 25);
    fonte("normal", 9.5); cor("#D4D1C9");
    doc.text("Resultado de " + lead.empresa + ", feito por " + lead.nome + " em " + hojeTxt() + ".", M, 34, { maxWidth: L });
    y = 54;

    // os numeros informados
    fonte("bold", 11); cor(COR.tinta); doc.text("Os números do mês", M, y); y += 6;
    var linhas = [["Gasto para atrair contatos", reais(z.gasto)], ["Pessoas que chamaram", milhar(String(z.chamaram))],
      ["Pessoas que fecharam", milhar(String(z.fecharam))], ["Primeira compra, em média", z.ticket !== null ? reais(z.ticket) : "não informado"],
      ["Voltas por ano", z.voltas !== null ? milhar(String(z.voltas)) : "não informado"]];
    linhas.forEach(function (l, i) {
      var col = i % 2, lx = M + col * (L / 2 + 2), ly = y + Math.floor(i / 2) * 7;
      fonte("normal", 9.5); cor(COR.fraco); doc.text(l[0], lx, ly);
      fonte("bold", 9.5); cor(COR.tinta); doc.text(l[1], lx + L / 2 - 4, ly, { align: "right" });
    });
    y += 3 * 7 + 4;

    // os quatro numeros grandes
    var cs = cartoes(z), cw = (L - 3 * 4) / 4;
    cs.forEach(function (c, i) {
      var x = M + i * (cw + 4), claro = c.tom === "destaque";
      cor(claro ? COR.sinal : COR.tinta, "f"); doc.roundedRect(x, y, cw, 30, 2.5, 2.5, "F");
      fonte("bold", 6.8); cor(claro ? "#3A2410" : COR.linha); doc.text(c.rot.toUpperCase(), x + 3, y + 6);
      fonte("bold", c.val.length > 11 ? 10 : 13); cor(claro ? COR.tinta : COR.ouro); doc.text(c.val, x + 3, y + 15, { maxWidth: cw - 6 });
      fonte("normal", 7); cor(claro ? "#3A2410" : "#CFCCC4"); doc.text(doc.splitTextToSize(c.sub, cw - 6), x + 3, y + 22);
    });
    y += 30 + 10;

    // do contato ao cliente
    fonte("bold", 11); cor(COR.tinta); doc.text("Do contato ao cliente", M, y); y += 5;
    var w2 = z.fecharam > 0 ? Math.max(L * z.fecharam / z.chamaram, 62) : 62, x2 = M + (L - w2) / 2, perd = z.chamaram - z.fecharam;
    cor(COR.tinta, "f"); doc.roundedRect(M, y, L, 16, 2, 2, "F");
    fonte("bold", 11); cor(COR.branco);
    doc.text(milhar(String(z.chamaram)) + " " + plural(z.chamaram, "pessoa chamou", "pessoas chamaram") + "   ·   " + reais(z.custoContato) + " cada", M + L / 2, y + 10, { align: "center" });
    cor(COR.papel, "f");
    doc.lines([[L - 2, 0], [(x2 + w2 - 1) - (M + L - 1), 14], [-(w2 - 2), 0]], M + 1, y + 17, [1, 1], "F", true);
    fonte("bold", 9); cor(COR.brasa);
    doc.text(perd > 0 ? milhar(String(perd)) + " " + plural(perd, "não fechou", "não fecharam") : "Todas fecharam", M + L / 2, y + 26, { align: "center" });
    cor(z.fecharam > 0 ? COR.sinal : COR.linha, "f"); doc.roundedRect(x2, y + 32, w2, 16, 2, 2, "F");
    fonte("bold", 11); cor(COR.tinta);
    doc.text(z.fecharam > 0 ? milhar(String(z.fecharam)) + " " + plural(z.fecharam, "fechou", "fecharam") : "Ninguém fechou", M + L / 2, y + 39, { align: "center" });
    if (z.fecharam > 0) { fonte("normal", 8.5); doc.text(reais(z.custoCliente) + " cada", M + L / 2, y + 44.5, { align: "center" }); }
    y += 48 + 10;

    // o que foi gasto e o que voltou
    if (z.primeira !== null) {
      var lin = barras(z), max = Math.max.apply(null, lin.map(function (l) { return l.v; }));
      cabe(10 + lin.length * 12);
      fonte("bold", 11); cor(COR.tinta); doc.text("O que foi gasto e o que voltou", M, y); y += 6;
      lin.forEach(function (l) {
        fonte("normal", 9); cor(COR.tinta); doc.text(l.rot, M, y);
        fonte("bold", 9); doc.text(reais(l.v), M + L, y, { align: "right" });
        cor("#ECE9E2", "f"); doc.roundedRect(M, y + 2, L, 4.5, 2.2, 2.2, "F");
        cor(l.cor, "f"); doc.roundedRect(M, y + 2, Math.max(L * l.v / max, 4.5), 4.5, 2.2, 2.2, "F");
        y += 12;
      });
      fonte("normal", 7.5); cor(COR.fraco); doc.text("Valores do que os clientes pagam, e não do lucro.", M, y); y += 8;
    }

    // a leitura em frase
    res.blocos.forEach(function (b) {
      fonte("normal", 9.5);
      var t = doc.splitTextToSize(b.texto, L - 6);
      cabe(9 + t.length * 4.6);
      cor(b.tom === "alerta" ? COR.brasa : COR.sinal, "f"); doc.rect(M, y - 4, 1.2, 6 + t.length * 4.6, "F");
      fonte("bold", 10.5); cor(COR.tinta); doc.text(b.titulo, M + 4, y);
      fonte("normal", 9.5); cor("#33302B"); doc.text(t, M + 4, y + 5.5);
      y += 9 + t.length * 4.6;
    });
    if (res.leitura) {
      fonte("normal", 9.5);
      var tl = doc.splitTextToSize(res.leitura, L - 12), hl = 14 + tl.length * 4.6;
      cabe(hl + 4);
      cor(COR.tinta, "f"); doc.roundedRect(M, y, L, hl, 2.5, 2.5, "F");
      fonte("bold", 10.5); cor(COR.ouro); doc.text("Por onde começar a olhar", M + 6, y + 8);
      fonte("normal", 9.5); cor("#E9E7E1"); doc.text(tl, M + 6, y + 14);
      y += hl + 8;
    }

    // a chamada
    fonte("normal", 9.5);
    var tc = doc.splitTextToSize("A conta mostra quanto custa cada cliente, mas não mostra por que tantas pessoas chamam e não fecham. No diagnóstico gratuito, a ZX olha esse resultado com você: de onde vêm os clientes, como é o atendimento até o fechamento e o que faz o cliente voltar.", L - 12);
    var hc = 26 + tc.length * 4.6;
    cabe(hc);
    cor(COR.sinal, "d"); doc.setLineWidth(0.6); doc.roundedRect(M, y, L, hc, 2.5, 2.5, "S");
    fonte("bold", 12); cor(COR.tinta); doc.text("Quer descobrir onde o cliente se perde no caminho?", M + 6, y + 9);
    fonte("normal", 9.5); cor("#33302B"); doc.text(tc, M + 6, y + 16);
    fonte("bold", 10.5); cor(COR.brasa);
    doc.textWithLink("Pedir o diagnóstico no WhatsApp: (62) 99311-6017", M + 6, y + hc - 6, { url: linkWhatsApp(res.mensagem) });
    rodape();
    return doc;
  }

  /* ---------- o pedido do PDF: popup, envio e download ---------- */
  function soDigitos(t) { return String(t || "").replace(/\D/g, ""); }
  function whatsValido(t) {
    var d = soDigitos(t);
    if ((d.length === 12 || d.length === 13) && d.indexOf("55") === 0) d = d.slice(2);
    return d.length === 10 || d.length === 11 ? d : null;
  }
  function origem() {
    try {
      var q = new URLSearchParams(raiz.location.search);
      return (q.get("origem") || q.get("utm_source") || (document.referrer ? new URL(document.referrer).hostname : "direto")).slice(0, 60);
    } catch (e) { return "direto"; }
  }

  // Envio com confirmacao (vbeta2, 17/10): a pagina LE a resposta do Apps Script e so' da' o contato
  // por registrado com {"ok":true}. text/plain evita o pre-voo, e o Apps Script responde com
  // Access-Control-Allow-Origin: *, entao a resposta e' legivel. Falha de rede ou demora: tenta de
  // novo ate' 3 vezes; o "id" deixa o Apps Script descartar a repeticao se a primeira tiver chegado.
  // Devolve "ok", "recusado", "falhou" ou "sem-endpoint".
  function tentar(dados) {
    var ida = fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(dados) })
      .then(function (r) { return r.json(); })
      .then(function (j) { return j && j.ok === true ? "ok" : "recusado"; }, function () { return "falhou"; });
    var espera = new Promise(function (r) { setTimeout(function () { r("falhou"); }, 8000); });
    return Promise.race([ida, espera]);
  }
  function enviar(dados) {
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(ENDPOINT)) return Promise.resolve("sem-endpoint");
    var pausas = [0, 1500, 4000];
    function rodada(i) {
      return new Promise(function (r) { setTimeout(r, pausas[i]); })
        .then(function () { return tentar(dados); })
        .then(function (st) { return st === "falhou" && i + 1 < pausas.length ? rodada(i + 1) : st; });
    }
    return rodada(0);
  }
  function novoId() {
    try { if (raiz.crypto && raiz.crypto.randomUUID) return raiz.crypto.randomUUID(); } catch (e) { /* segue */ }
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }


  /* ---------- campos do formulario (17/10: nome completo, e-mail e CNPJ opcional) ---------- */
  // nome completo: pelo menos duas palavras com 2 letras ou mais ("Joana M" nao libera, "Joana Marques" libera)
  function nomeCompleto(t) {
    var p = String(t || "").trim().split(/\s+/).filter(function (w) { return w.replace(/[^A-Za-z\u00C0-\u00FF]/g, "").length >= 2; });
    return p.length >= 2;
  }
  function emailValido(t) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(t || "").trim()); }
  // CNPJ opcional: vazio devolve ""; preenchido precisa de 14 digitos com os 2 verificadores certos, senao null
  function cnpjValido(t) {
    var d = String(t || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.length !== 14 || /^(\d)\1+$/.test(d)) return null;
    function dv(n) {
      var pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], s = 0;
      for (var i = 0; i < n; i++) s += Number(d[i]) * pesos[i];
      var r = s % 11;
      return r < 2 ? 0 : 11 - r;
    }
    return dv(12) === Number(d[12]) && dv(13) === Number(d[13]) ? d : null;
  }

  var ultimo = null, pedido = null;

  function baixarPDF() {
    var slug = pedido.lead.empresa.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
    montarPDF(pedido.res, pedido.z, pedido.lead).save("resultado-calculadora-zx" + (slug ? "-" + slug : "") + ".pdf");
  }

  function erroLead(id, txt) {
    var e = el("le-" + id);
    e.textContent = txt;
    e.hidden = !txt;
    var i = el("l-" + id);
    if (i) { if (txt) i.setAttribute("aria-invalid", "true"); else i.removeAttribute("aria-invalid"); }
  }

  function abrirPopup() {
    if (!ultimo) return;
    var pop = el("popup");
    el("lead-campos").hidden = false;
    el("lead-pronto").hidden = true;
    if (typeof pop.showModal === "function") pop.showModal(); else pop.setAttribute("open", "");
    el("l-nome").focus();
  }
  function fecharPopup() {
    var pop = el("popup");
    if (typeof pop.close === "function") pop.close(); else pop.removeAttribute("open");
    el("baixar").focus();
  }

  function pedirPDF(ev) {
    ev.preventDefault();
    var nome = el("l-nome").value.trim(), emp = el("l-empresa").value.trim(), w = whatsValido(el("l-whatsapp").value);
    var aceite = el("l-aceite").checked, mail = el("l-email").value.trim(), cnpj = cnpjValido(el("l-cnpj").value);
    var nomeOk = nomeCompleto(nome), mailOk = emailValido(mail);
    erroLead("nome", nomeOk ? "" : "Digite o nome completo, com nome e sobrenome.");
    erroLead("email", mailOk ? "" : "Digite um e-mail válido, por exemplo nome@empresa.com.br.");
    erroLead("whatsapp", w ? "" : "Digite o WhatsApp com DDD, por exemplo (62) 99999-9999.");
    erroLead("empresa", emp.length >= 2 ? "" : "Digite o nome da empresa.");
    erroLead("cnpj", cnpj !== null ? "" : "Confira o CNPJ: são 14 números. Se preferir, deixe em branco.");
    erroLead("aceite", aceite ? "" : "Para receber o PDF, marque a autorização acima.");
    erroLead("geral", "");
    if (!nomeOk || !mailOk || !w || emp.length < 2 || cnpj === null || !aceite) {
      var inv = el("lead").querySelector('[aria-invalid="true"]');
      (inv || el("l-aceite")).focus();
      return;
    }
    var z = ultimo.z;
    var dados = {
      id: novoId(), nome: nome, email: mail, whatsapp: w, empresa: emp, cnpj: cnpj, aceite: true, materiais: true,
      site: el("l-site").value,
      gasto: z.gasto, chamaram: z.chamaram, fecharam: z.fecharam, ticket: z.ticket, voltas: z.voltas,
      custo_contato: arred(z.custoContato, 2), custo_cliente: z.custoCliente === null ? null : arred(z.custoCliente, 2),
      de_cada_100: arred(z.de100, 1), cliente_no_ano: z.clienteAno === null ? null : arred(z.clienteAno, 2),
      origem: origem(), pagina: String(raiz.location.href).split("#")[0].slice(0, 200)
    };
    var bt = el("lead-enviar");
    bt.disabled = true;
    bt.textContent = "Preparando o PDF...";
    pedido = { res: ultimo.res, z: z, lead: { nome: nome, empresa: emp, whatsapp: w } };
    enviar(dados).then(function (st) {
      // o PDF sai mesmo se o envio falhar: a pessoa fez a parte dela. Mas a falha nao passa calada:
      // a tela final troca o texto e o WhatsApp leva nome e empresa, para o contato chegar por la'.
      var registrado = st === "ok";
      var falhou = false;
      try { baixarPDF(); } catch (e) {
        falhou = true;
        erroLead("geral", "Não foi possível montar o PDF neste navegador. Tente de novo ou fale com a gente no WhatsApp.");
      }
      bt.disabled = false;
      bt.textContent = "Baixar meu PDF";
      if (!falhou) {
        var msg = ultimo.res.mensagem;
        if (!registrado) msg = "Olá! Sou " + nome + ", da " + emp + ". " + msg.replace(/^Olá! /, "");
        el("whats-pronto").href = linkWhatsApp(msg);
        el("pronto-ok").hidden = !registrado;
        el("pronto-falha").hidden = registrado;
        el("whats-pronto").textContent = registrado ? "Conversar no WhatsApp" : "Mandar meu contato pelo WhatsApp";
        el("lead-campos").hidden = true;
        el("lead-pronto").hidden = false;
        el("pronto-titulo").focus();
      }
    });
  }

  var calculou = false;
  function rodar(focar) {
    var d = lerForm();
    var res = calcular(d);
    if (res.ok) {
      calculou = true;
      ultimo = { res: res, z: resumo(res, d) };
      desenharPainel(ultimo.z);
    }
    mostrar(res, focar);
  }

  function iniciar() {
    var form = el("calc");
    form.addEventListener("submit", function (ev) { ev.preventDefault(); rodar(true); });
    CAMPOS.forEach(function (k) {
      el("c-" + k).addEventListener("input", function () { if (calculou) rodar(false); });
    });
    el("exemplo").addEventListener("click", function () {
      CAMPOS.forEach(function (k) { el("c-" + k).value = EXEMPLO[k]; });
      el("exemplo-aviso").hidden = false;
      rodar(true);
    });
    el("whats").href = linkWhatsApp(mensagemWhatsApp(null));
    el("baixar").addEventListener("click", abrirPopup);
    el("popup-fechar").addEventListener("click", fecharPopup);
    el("popup").addEventListener("click", function (ev) { if (ev.target === el("popup")) fecharPopup(); });
    el("lead").addEventListener("submit", pedirPDF);
    el("baixar-de-novo").addEventListener("click", function () { if (pedido) baixarPDF(); });
    // o formulario de aplicacao so' aparece quando o link existir de verdade
    var porta = el("porta-formulario");
    var link = porta.getAttribute("data-formulario") || "";
    if (/^https:\/\//.test(link)) {
      el("formulario").href = link;
      porta.hidden = false;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})(this);
