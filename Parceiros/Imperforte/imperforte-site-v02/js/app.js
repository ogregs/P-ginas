(function () {
var d = document, w = window, cfg = w.IMPERFORTE || {};
w.dataLayer = w.dataLayer || [];
if (w.location.protocol === 'file:') {
var ls = d.querySelectorAll('a[href]');
for (var i = 0; i < ls.length; i++) {
var u = ls[i].href;
if (u.indexOf('file:') !== 0) continue;
var c = u.search(/[?#]/), base = c < 0 ? u : u.slice(0, c), resto = c < 0 ? '' : u.slice(c);
if (base.charAt(base.length - 1) === '/') ls[i].href = base + 'index.html' + resto;
}
}
function evento(nome, dados) { var o = { event: nome, pagina: cfg.nomePagina || '' }; for (var k in dados) o[k] = dados[k]; w.dataLayer.push(o); }
d.addEventListener('click', function (e) {
var a = e.target.closest ? e.target.closest('a') : null;
if (!a) return;
if (a.hasAttribute('data-wpp')) evento('clique_whatsapp', { produto: a.getAttribute('data-wpp') || '', local: a.getAttribute('data-local') || '' });
if (a.hasAttribute('data-ficha')) evento('abrir_ficha_tecnica', { fabricante: a.getAttribute('data-fabricante') || '', produto: a.getAttribute('data-ficha') || '' });
});
var calmo = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!calmo && 'IntersectionObserver' in w) {
d.documentElement.classList.add('anima');
var io = new IntersectionObserver(function (es) {
es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
}, { rootMargin: '0px 0px -8% 0px' });
d.querySelectorAll('.rv, figure.corte').forEach(function (el) { io.observe(el); });
}
var filtro = d.querySelector('.filtro');
if (filtro) {
var itens = d.querySelectorAll('.vitrine .item'), grupos = d.querySelectorAll('.vitrine .grupo');
var chips = filtro.querySelectorAll('.chip[data-tipo]');
var todos = filtro.querySelector('.chip-todos');
function aplicar(tipo, valor) {
itens.forEach(function (it) {
var ok = !tipo || (' ' + (it.getAttribute('data-' + tipo) || '') + ' ').indexOf(' ' + valor + ' ') >= 0;
it.hidden = !ok;
});
grupos.forEach(function (g) { g.hidden = !!tipo && !g.querySelector('.item:not([hidden])') && !(tipo === 'problema' && g.id === valor); });
chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-tipo') === tipo && c.getAttribute('data-valor') === valor)); });
if (todos) todos.setAttribute('aria-pressed', String(!tipo));
}
chips.forEach(function (c) {
c.setAttribute('role', 'button'); c.setAttribute('aria-pressed', 'false');
c.addEventListener('click', function (e) {
e.preventDefault();
var tipo = c.getAttribute('data-tipo'), valor = c.getAttribute('data-valor');
aplicar(tipo, valor);
evento('filtro_vitrine', { tipo: tipo, valor: valor });
var alvo = d.getElementById('vitrine'); if (alvo) alvo.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'start' });
});
c.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); c.click(); } });
});
if (todos) {
todos.hidden = false;
todos.addEventListener('click', function () { aplicar(null, null); evento('filtro_vitrine', { tipo: 'todos', valor: '' }); });
}
var h = (location.hash || '').slice(1);
if (h) { var c0 = filtro.querySelector('.chip[data-tipo="problema"][data-valor="' + h + '"]'); if (c0) aplicar('problema', h); }
}
var f = d.getElementById('form-consulta');
if (f) {
f.hidden = false;
var q = (location.search.match(/[?&]produto=([^&]+)/) || [])[1];
if (q && f.produto) f.produto.value = decodeURIComponent(q.replace(/\+/g, ' '));
f.addEventListener('submit', function (e) {
e.preventDefault();
var v = function (n) { return (f[n] && f[n].value || '').trim(); };
var r = function (n) { var x = f.querySelector('input[name="' + n + '"]:checked'); return x ? x.value : ''; };
var linhas = ['Olá, vim pelo site e quero ajuda para escolher o material.',
'Onde vou aplicar: ' + (r('uso') || '__'),
'O que está acontecendo: ' + (r('situacao') || '__'),
'Tamanho aproximado: ' + (v('tamanho') || '__'),
'Obra em: ' + (v('obra') || '__')];
if (v('produto')) linhas.push('Produto ou especificação: ' + v('produto'));
linhas.push('Nota fiscal: ' + (r('nota') || '__'));
linhas.push('Posso mandar foto da área por aqui.');
evento('clique_whatsapp', { produto: v('produto') || r('uso'), local: 'ficha-consulta' });
w.open('https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
});
}
})();