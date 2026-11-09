# Caderno de achados -- auditoria de entrega

**Alvo:** `C:\jarvis\vault\projects\zx-digital\clientes\ativos\imperforte\_producao\site-novo-2026-11-03\_deploy\imperforte_site-deploy-aprovacao_vdef3_2026-11-09`

| # | Meio | Gravidade | Achado | Onde |
|---|---|---|---|---|
| 1 | imagem | MEDIA | 17% do quadro com branco estourado | `apple-touch-icon.png` |
| 2 | web | MEDIA | vao de 68px contra mediana 104px da pagina (razao 0.65) — {'vao': 68, 'mediana': 104} | `sec -> faixa-custo @320px` |
| 3 | web | MEDIA | vao de 56px contra mediana 104px da pagina (razao 0.54) — {'vao': 56, 'mediana': 104} | `faixa-custo -> sec @320px` |
| 4 | web | MEDIA | vao de 68px contra mediana 104px da pagina (razao 0.65) — {'vao': 68, 'mediana': 104} | `sec -> faixa-custo @390px` |
| 5 | web | MEDIA | vao de 56px contra mediana 104px da pagina (razao 0.54) — {'vao': 56, 'mediana': 104} | `faixa-custo -> sec @390px` |
| 6 | web | MEDIA | vao de 56px contra mediana 104px da pagina (razao 0.54) — {'vao': 56, 'mediana': 104} | `sec -> faixa-custo @768px` |
| 7 | web | MEDIA | vao de 61px contra mediana 104px da pagina (razao 0.59) — {'vao': 61, 'mediana': 104} | `faixa-custo -> sec @768px` |
| 8 | web | MEDIA | vao de 56px contra mediana 104px da pagina (razao 0.54) — {'vao': 56, 'mediana': 104} | `sec -> faixa-custo @1440px` |
| 9 | web | MEDIA | vao de 61px contra mediana 104px da pagina (razao 0.59) — {'vao': 61, 'mediana': 104} | `faixa-custo -> sec @1440px` |
| 10 | web | MEDIA | vao de 56px contra mediana 104px da pagina (razao 0.54) — {'vao': 56, 'mediana': 104} | `sec -> faixa-custo @1920px` |
| 11 | web | MEDIA | vao de 61px contra mediana 104px da pagina (razao 0.59) — {'vao': 61, 'mediana': 104} | `faixa-custo -> sec @1920px` |
| 12 | web | MEDIA | alvo de toque 201x19px (minimo 44 de altura) — {'sel': 'A.', 'w': 201, 'h': 19, 'txt': 'Fonte: Guia da Engenharia'} | `A. @320px` |
| 13 | web | MEDIA | alvo de toque 201x19px (minimo 44 de altura) — {'sel': 'A.', 'w': 201, 'h': 19, 'txt': 'Fonte: Guia da Engenharia'} | `A. @768px` |
| 14 | web | ALTA | faixa de 26px com a cor do fundo entre dois blocos de mesma cor — {'faixa': [255, 255, 255], 'vizinhos': [[0, 89, 171], [154, 103, 0]]} | `y 117-143 @320px` |
| 15 | web | MEDIA | vao de 72px contra mediana 112px da pagina (razao 0.64) — {'vao': 72, 'mediana': 112} | `caixa -> capa @320px` |
| 16 | web | MEDIA | vao de 48px contra mediana 112px da pagina (razao 0.43) — {'vao': 48, 'mediana': 112} | `capa -> numeros-s @320px` |
| 17 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `numeros-s -> sec @320px` |
| 18 | imagem | MEDIA | 43% do quadro com branco estourado | `am712-152.webp` |
| 19 | imagem | MEDIA | 44% do quadro com branco estourado | `am712-300.webp` |
| 20 | imagem | MEDIA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 46 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 46.0, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `area-molhada-480.webp` |
| 21 | imagem | ALTA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 23 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 23.5, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `area-molhada-720.webp` |
| 22 | imagem | MEDIA | 55% do quadro com branco estourado | `flow-2300-152.webp` |
| 23 | imagem | MEDIA | 55% do quadro com branco estourado | `flow-2300-300.webp` |
| 24 | imagem | MEDIA | 65% do quadro com branco estourado | `injekt-1264-152.webp` |
| 25 | imagem | MEDIA | 66% do quadro com branco estourado | `injekt-1264-300.webp` |
| 26 | imagem | MEDIA | 61% do quadro com branco estourado | `injekt-2133-152.webp` |
| 27 | imagem | MEDIA | 62% do quadro com branco estourado | `injekt-2133-300.webp` |
| 28 | imagem | ALTA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 7 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 6.6, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `piscina-480.webp` |
| 29 | imagem | ALTA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 14 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 13.6, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `piscina-720.webp` |
| 30 | imagem | MEDIA | 53% do quadro com branco estourado | `quick-152.webp` |
| 31 | imagem | MEDIA | 54% do quadro com branco estourado | `quick-300.webp` |
| 32 | imagem | MEDIA | 55% do quadro com branco estourado | `vulkem-350nf-152.webp` |
| 33 | imagem | MEDIA | 56% do quadro com branco estourado | `vulkem-350nf-300.webp` |
| 34 | imagem | MEDIA | 54% do quadro com branco estourado | `xypex-con-152.webp` |
| 35 | imagem | MEDIA | 54% do quadro com branco estourado | `xypex-con-300.webp` |
| 36 | imagem | MEDIA | 54% do quadro com branco estourado | `xypex-mod-152.webp` |
| 37 | imagem | MEDIA | 55% do quadro com branco estourado | `xypex-mod-300.webp` |
| 38 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `sec -> faixa-custo @320px` |
| 39 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `faixa-custo -> sec @320px` |
| 40 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `sec -> faixa-custo @390px` |
| 41 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `faixa-custo -> sec @390px` |
| 42 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `sec -> faixa-custo @768px` |
| 43 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `faixa-custo -> sec @768px` |
| 44 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `sec -> faixa-custo @1440px` |
| 45 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `faixa-custo -> sec @1440px` |
| 46 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `sec -> faixa-custo @1920px` |
| 47 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `faixa-custo -> sec @1920px` |
| 48 | web | MEDIA | vao de 48px contra mediana 112px da pagina (razao 0.43) — {'vao': 48, 'mediana': 112} | `capa -> numeros-s @320px` |
| 49 | web | MEDIA | vao de 56px contra mediana 112px da pagina (razao 0.50) — {'vao': 56, 'mediana': 112} | `numeros-s -> sec @320px` |
| 50 | imagem | MEDIA | 12% do quadro com branco estourado | `imperforte-logo-512.png` |
| 51 | web | MEDIA | alvo de toque 258x39px (minimo 44 de altura) — {'sel': 'A.', 'w': 258, 'h': 39, 'txt': 'Veja como escolher o mater'} | `A. @320px` |
| 52 | web | MEDIA | alvo de toque 326x39px (minimo 44 de altura) — {'sel': 'A.', 'w': 326, 'h': 39, 'txt': 'Veja como escolher o mater'} | `A. @390px` |
| 53 | web | MEDIA | alvo de toque 226x16px (minimo 44 de altura) — {'sel': 'A.', 'w': 226, 'h': 16, 'txt': 'Veja como escolher o mater'} | `A. @768px` |
| 54 | texto | MEDIA | secao vazia: 'Previa para aprovacao do cliente: nao indexa' | `robots.txt` |
| 55 | web | MEDIA | vao de 48px contra mediana 113px da pagina (razao 0.42) — {'vao': 48, 'mediana': 113} | `capa -> numeros-s @320px` |
| 56 | web | MEDIA | vao de 56px contra mediana 113px da pagina (razao 0.50) — {'vao': 56, 'mediana': 113} | `numeros-s -> sec @320px` |

> Fase 1.1 (instrumento). A passada humana e as Fases 2 e 3 estao em
> `playbooks/auditar-entrega.md`.
