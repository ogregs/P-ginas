(function () {
var d = document, w = window, html = d.documentElement;
w.dataLayer = w.dataLayer || [];
var CFG = w.ATIVA || {};
var pagina = d.body.getAttribute('data-pagina') || 'site';
function evento(nome, dados) {
var o = { event: nome, ativa_pagina: pagina };
for (var k in dados) o[k] = dados[k];
w.dataLayer.push(o);
return o;
}
var reduz = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduz && 'IntersectionObserver' in w) {
html.classList.add('anima');
var io = new IntersectionObserver(function (es) {
es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
var alvos = [].slice.call(d.querySelectorAll('.rv, .regua'));
alvos.forEach(function (el) { io.observe(el); });
var pend = false;
function varre() {
pend = false;
var lim = w.innerHeight * 0.96;
alvos = alvos.filter(function (el) {
if (el.getBoundingClientRect().top < lim) { el.classList.add('in'); io.unobserve(el); return false; }
return true;
});
if (!alvos.length) w.removeEventListener('scroll', aoRolar);
}
function aoRolar() { if (!pend) { pend = true; w.requestAnimationFrame(varre); } }
w.addEventListener('scroll', aoRolar, { passive: true });
w.addEventListener('load', varre);
}
d.addEventListener('click', function (ev) {
var a = ev.target.closest && ev.target.closest('a');
if (!a) return;
var href = a.getAttribute('href') || '';
if (href.indexOf('wa.me/') > -1 || href.indexOf('api.whatsapp.com') > -1) {
evento('ativa_whatsapp_clique', { ativa_local: a.getAttribute('data-local') || 'link' });
} else if (href.indexOf('tel:') === 0) {
evento('ativa_telefone_clique', { ativa_local: a.getAttribute('data-local') || 'link' });
}
});
var f = d.getElementById('form-pedido');
if (!f) return;
var ITENS = CFG.itens || [];
var REFS = CFG.referencias || [];
var iniciou = false;
var previa = d.getElementById('previa');
var aviso = d.getElementById('aviso');
var campoTexto = f.querySelector('textarea[name=text]');
function marcaInicio() {
if (iniciou) return;
iniciou = true;
evento('ativa_pedido_iniciado', {});
}
function val(nome) {
var el = f.querySelector('[name="' + nome + '"]:checked') || f.querySelector('[name="' + nome + '"]:not([type=radio]):not([type=checkbox])');
return el ? (el.value || '').trim() : '';
}
function qtd(id) {
var el = d.getElementById('q-' + id);
var n = parseInt(el && el.value, 10);
return isNaN(n) || n < 0 ? 0 : Math.min(n, 9999);
}
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function monta() {
var linhas = [], totalPac = 0, nomes = [];
ITENS.forEach(function (it) {
var n = qtd(it.id);
var box = d.getElementById('i-' + it.id);
var tot = d.getElementById('t-' + it.id);
if (box) box.classList.toggle('ativo', n > 0);
if (tot) tot.textContent = n > 0 ? (n + ' × ' + it.pacote + ' = ' + fmt(n * it.pacote) + ' unidades') : '';
if (n > 0) {
var nome = it.nome;
if (it.id === 'saco-alvejado') {
var r = val('referencia');
if (r) nome += ' (' + r + ')';
}
linhas.push('• ' + nome + ': ' + n + (n === 1 ? ' pacote' : ' pacotes') + ' de ' + it.pacote + ' = ' + fmt(n * it.pacote) + ' unidades');
totalPac += n; nomes.push(it.id);
}
});
var extras = [];
f.querySelectorAll('input[name=extra]:checked').forEach(function (c) { extras.push(c.value); });
var ramo = val('ramo'), cidade = val('cidade'), empresa = val('empresa'), nota = val('nota'), quando = val('quando'), obs = val('obs'),
pagamento = val('pagamento'), ean = val('ean');
var t = 'Olá, Ativa! Pedido montado no site (página: ' + (CFG.nomePagina || pagina) + ').\n';
if (ramo) t += 'Ramo: ' + ramo + '\n';
if (empresa) t += 'Empresa: ' + empresa + '\n';
t += 'Itens:\n' + (linhas.length ? linhas.join('\n') : '(nenhum pacote escolhido)') + '\n';
if (extras.length) t += 'Também quero cotação de: ' + extras.join(', ') + '\n';
if (cidade) t += 'Cidade: ' + cidade + '\n';
if (nota) t += 'Nota fiscal: ' + nota + '\n';
if (pagamento) t += 'Pagamento preferido: ' + pagamento + '\n';
if (ean) t += 'Código de barras nas peças: ' + ean + '\n';
if (quando) t += 'Para quando: ' + quando + '\n';
if (obs) t += 'Observação: ' + obs + '\n';
if (previa) previa.textContent = t;
if (campoTexto) campoTexto.value = t;
return { texto: t, totalPac: totalPac, nomes: nomes, ramo: ramo, cidade: cidade, extras: extras };
}
f.addEventListener('click', function (ev) {
var b = ev.target.closest && ev.target.closest('button[data-passo]');
if (!b) return;
ev.preventDefault();
marcaInicio();
var inp = d.getElementById('q-' + b.getAttribute('data-item'));
var n = parseInt(inp.value, 10) || 0;
n = Math.max(0, Math.min(9999, n + parseInt(b.getAttribute('data-passo'), 10)));
inp.value = n;
monta();
});
f.addEventListener('input', function () { marcaInicio(); monta(); });
f.addEventListener('change', function () { marcaInicio(); monta(); });
var m = /[?&]item=([a-z\-]+)/.exec(w.location.search);
if (m) {
var alvo = d.getElementById('q-' + m[1]);
if (alvo && !parseInt(alvo.value, 10)) { alvo.value = 1; }
var ex = f.querySelector('input[name=extra][data-id="' + m[1] + '"]');
if (ex) ex.checked = true;
}
monta();
f.addEventListener('submit', function (ev) {
ev.preventDefault();
var r = monta();
var falta = [];
if (!r.ramo) falta.push('o seu ramo');
if (r.totalPac < 1 && !r.extras.length) falta.push('pelo menos um pacote de algum item');
if (!r.cidade) falta.push('a sua cidade');
if (falta.length) {
aviso.innerHTML = 'Falta ' + falta.join(', ') + '. ' + (r.totalPac < 1 && !r.extras.length ? 'Para menos de um pacote, a compra é no <a href="' + CFG.linkBalcao + '">balcão do depósito</a>.' : '');
aviso.classList.add('on');
aviso.focus();
return;
}
aviso.classList.remove('on');
var url = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(r.texto);
var foi = false;
function vai() { if (foi) return; foi = true; w.location.href = url; }
evento('ativa_pedido_enviado', {
ativa_ramo: r.ramo, ativa_itens: r.nomes.join(','), ativa_pacotes_total: r.totalPac,
ativa_cotacao_extra: r.extras.join(','), ativa_cidade: r.cidade,
eventCallback: vai, eventTimeout: 900
});
setTimeout(vai, 1000);
});
})();