# Caderno de achados -- auditoria de entrega

**Alvo:** `iesus_site-novo_deploy_vbeta6_2026-11-10/site`

| # | Meio | Gravidade | Achado | Onde |
|---|---|---|---|---|
| 1 | web | MEDIA | vao de 72px contra mediana 170px da pagina (razao 0.42) — {'vao': 72, 'mediana': 170} | `topo -> cap @320px` |
| 2 | web | MEDIA | vao de 72px contra mediana 175px da pagina (razao 0.41) — {'vao': 72, 'mediana': 175} | `topo -> cap @390px` |
| 3 | web | MEDIA | vao de 77px contra mediana 189px da pagina (razao 0.41) — {'vao': 77, 'mediana': 189} | `topo -> cap @768px` |
| 4 | web | MEDIA | vao de 136px contra mediana 288px da pagina (razao 0.47) — {'vao': 136, 'mediana': 288} | `topo -> cap @1440px` |
| 5 | web | MEDIA | vao de 136px contra mediana 288px da pagina (razao 0.47) — {'vao': 136, 'mediana': 288} | `topo -> cap @1920px` |
| 6 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 7 | imagem | MEDIA | quadro subexposto: luminancia media 25 de 255 | `apple-touch-icon.png` |
| 8 | imagem | MEDIA | dimensao 800x600 para exibir a 362px (regra: no maximo ~2x) | `detalhe-familia-800.webp` |
| 9 | imagem | MEDIA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 36 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 35.6, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `detalhe-marmore-1200.webp` |
| 10 | imagem | MEDIA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 26 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 26.0, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `detalhe-marmore-480.webp` |
| 11 | imagem | MEDIA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 30 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 30.0, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `detalhe-marmore-800.webp` |
| 12 | imagem | MEDIA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 56 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 56.1, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `detalhe-mesa-1200.webp` |
| 13 | imagem | MEDIA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 49 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 49.0, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `detalhe-mesa-480.webp` |
| 14 | imagem | MEDIA | imagem mole (tamanho do arquivo -- passe --exibicao para julgar no tamanho real): variancia do laplaciano 44 (abaixo de 60 nao se conserta com filtro -- trocar a fonte) — {'nitidez': 43.6, 'escala': 'tamanho do arquivo -- passe --exibicao para julgar no tamanho real'} | `detalhe-mesa-800.webp` |
| 15 | imagem | MEDIA | quadro subexposto: luminancia media 25 de 255 | `favicon-32.png` |
| 16 | imagem | MEDIA | quadro subexposto: luminancia media 25 de 255 | `icon-512.png` |
| 17 | imagem | MEDIA | conteudo ativo nos 28%% de baixo -- zona que a UI do Reels cobre — {'linhas_ativas': 73} | `poster-cliente-por-anos.webp` |
| 18 | imagem | MEDIA | conteudo ativo nos 28%% de baixo -- zona que a UI do Reels cobre — {'linhas_ativas': 122} | `poster-eleicoes-reforma.webp` |
| 19 | video | BAIXA | GATE NAO MEDIDO: cortes e deriva NAO MEDIDO: 3 cortes detectados, sem --cortes para comparar | `iesus-cliente-por-anos.mp4` |
| 20 | video | BAIXA | GATE NAO MEDIDO: marca em todos os quadros faixa da marca nao informada (--marca-de/--marca-ate) | `iesus-cliente-por-anos.mp4` |
| 21 | video | BAIXA | LEGENDA NAO MEDIDA: mp4 sem projeto CapCut — este auditor so' le legenda pelo projeto; em video por codigo a legenda queimada nao entra em margem, area segura, tamanho nem cobertura de rosto e detalhe. Conferir na passada humana: folha de contato com 2 quadros por take e as linhas de 14% e 65% desenhadas | `iesus-cliente-por-anos` |
| 22 | video | BAIXA | COR DA PELE NAO MEDIDA: geometria de apoio desconhecida — mp4 solto, sem projeto CapCut e sem --apoio: nao ha' como separar a cena de apoio (rosto/corpo de outra pessoa em tela cheia) da pele do apresentador, e medir pelo caminho ingenuo ja' produziu falso positivo real (DERIVA) no acervo. Declare --apoio "" se a peca de fato nao tem apoio nenhum, ou --apo | `iesus-cliente-por-anos` |
| 23 | video | BAIXA | GATE NAO MEDIDO: cortes e deriva NAO MEDIDO: 11 cortes detectados, sem --cortes para comparar | `iesus-eleicoes-reforma-tributaria.mp4` |
| 24 | video | BAIXA | GATE NAO MEDIDO: marca em todos os quadros faixa da marca nao informada (--marca-de/--marca-ate) | `iesus-eleicoes-reforma-tributaria.mp4` |
| 25 | video | BAIXA | LEGENDA NAO MEDIDA: mp4 sem projeto CapCut — este auditor so' le legenda pelo projeto; em video por codigo a legenda queimada nao entra em margem, area segura, tamanho nem cobertura de rosto e detalhe. Conferir na passada humana: folha de contato com 2 quadros por take e as linhas de 14% e 65% desenhadas | `iesus-eleicoes-reforma-tributaria` |
| 26 | video | BAIXA | COR DA PELE NAO MEDIDA: geometria de apoio desconhecida — mp4 solto, sem projeto CapCut e sem --apoio: nao ha' como separar a cena de apoio (rosto/corpo de outra pessoa em tela cheia) da pele do apresentador, e medir pelo caminho ingenuo ja' produziu falso positivo real (DERIVA) no acervo. Declare --apoio "" se a peca de fato nao tem apoio nenhum, ou --apo | `iesus-eleicoes-reforma-tributaria` |
| 27 | web | MEDIA | parede de texto: 1027 caracteres de prosa e nenhuma imagem na seccao — {'nome': 'cap', 'chars': 1027, 'midia': 0} | `cap @320px` |
| 28 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 29 | web | MEDIA | alvo de toque 175x42px (minimo 44 de altura) — {'sel': 'A.', 'w': 175, 'h': 42, 'txt': 'Política de privacidade'} | `A. @320px` |
| 30 | web | MEDIA | alvo de toque 250x19px (minimo 44 de altura) — {'sel': 'A.', 'w': 250, 'h': 19, 'txt': 'Acesse a área do cliente n'} | `A. @390px` |
| 31 | web | MEDIA | alvo de toque 270x42px (minimo 44 de altura) — {'sel': 'A.', 'w': 270, 'h': 42, 'txt': 'Política de privacidade'} | `A. @390px` |
| 32 | web | MEDIA | alvo de toque 250x19px (minimo 44 de altura) — {'sel': 'A.', 'w': 250, 'h': 19, 'txt': 'Acesse a área do cliente n'} | `A. @768px` |
| 33 | web | MEDIA | alvo de toque 164x18px (minimo 44 de altura) — {'sel': 'A.', 'w': 164, 'h': 18, 'txt': 'Política de privacidade'} | `A. @768px` |
| 34 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 35 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 36 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 37 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 38 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 39 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 40 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 41 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 42 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 43 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 44 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 45 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 46 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 47 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 48 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 49 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 50 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 51 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 52 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 53 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 54 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 55 | web | MEDIA | vao de 77px contra mediana 154px da pagina (razao 0.50) — {'vao': 77, 'mediana': 154} | `topo -> cap @768px` |
| 56 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 57 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 58 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 59 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 60 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 61 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 62 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 63 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 64 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 65 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 66 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 67 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 68 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 69 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 70 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 71 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 72 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 73 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 74 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 75 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 76 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 77 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 78 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 79 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 80 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 81 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 82 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 83 | web | MEDIA | vao de 71px contra mediana 144px da pagina (razao 0.49) — {'vao': 71, 'mediana': 144} | `topo -> cap @320px` |
| 84 | web | MEDIA | vao de 71px contra mediana 144px da pagina (razao 0.49) — {'vao': 71, 'mediana': 144} | `topo -> cap @390px` |
| 85 | web | MEDIA | vao de 76px contra mediana 149px da pagina (razao 0.51) — {'vao': 76, 'mediana': 149} | `topo -> cap @768px` |
| 86 | web | MEDIA | vao de 135px contra mediana 254px da pagina (razao 0.53) — {'vao': 135, 'mediana': 254} | `topo -> cap @1440px` |
| 87 | web | MEDIA | vao de 135px contra mediana 254px da pagina (razao 0.53) — {'vao': 135, 'mediana': 254} | `topo -> cap @1920px` |
| 88 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 89 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 90 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 91 | web | MEDIA | vao de 77px contra mediana 154px da pagina (razao 0.50) — {'vao': 77, 'mediana': 154} | `topo -> cap @768px` |
| 92 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 93 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 94 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 95 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 96 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 97 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 98 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 99 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 100 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 101 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 102 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 103 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 104 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 105 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 106 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 107 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 108 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 109 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 110 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 111 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 112 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 113 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 114 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 115 | web | MEDIA | vao de 77px contra mediana 154px da pagina (razao 0.50) — {'vao': 77, 'mediana': 154} | `topo -> cap @768px` |
| 116 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 117 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 118 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 119 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 120 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 121 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 122 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 123 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 124 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 125 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 126 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 127 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 128 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 129 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 130 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 131 | web | ALTA | texto sobre imagem: contraste 3.08 no pior caso (min 4.5) — {'texto': 'Sua empresa', 'fundo_p95': [162, 175, 188]} | `SPAN.ct-rot @320px` |
| 132 | web | ALTA | texto sobre imagem: contraste 3.08 no pior caso (min 4.5) — {'texto': 'Sua empresa', 'fundo_p95': [165, 174, 187]} | `SPAN.ct-rot @1920px` |
| 133 | web | MEDIA | vao de 71px contra mediana 169px da pagina (razao 0.42) — {'vao': 71, 'mediana': 169} | `cap -> retrato @320px` |
| 134 | web | MEDIA | vao de 73px contra mediana 169px da pagina (razao 0.43) — {'vao': 73, 'mediana': 169} | `cap -> sala @320px` |
| 135 | web | MEDIA | vao de 71px contra mediana 169px da pagina (razao 0.42) — {'vao': 71, 'mediana': 169} | `cap -> retrato @390px` |
| 136 | web | MEDIA | vao de 73px contra mediana 169px da pagina (razao 0.43) — {'vao': 73, 'mediana': 169} | `cap -> sala @390px` |
| 137 | web | MEDIA | vao de 76px contra mediana 186px da pagina (razao 0.41) — {'vao': 76, 'mediana': 186} | `cap -> retrato @768px` |
| 138 | web | MEDIA | vao de 77px contra mediana 186px da pagina (razao 0.41) — {'vao': 77, 'mediana': 186} | `cap -> sala @768px` |
| 139 | web | MEDIA | vao de 77px contra mediana 186px da pagina (razao 0.41) — {'vao': 77, 'mediana': 186} | `sala -> cap @768px` |
| 140 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `cap -> retrato @1440px` |
| 141 | web | MEDIA | vao de 161px contra mediana 272px da pagina (razao 0.59) — {'vao': 161, 'mediana': 272} | `retrato -> cap @1440px` |
| 142 | web | MEDIA | vao de 137px contra mediana 272px da pagina (razao 0.50) — {'vao': 137, 'mediana': 272} | `cap -> sala @1440px` |
| 143 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `sala -> cap @1440px` |
| 144 | web | MEDIA | vao de 49px contra mediana 272px da pagina (razao 0.18) — {'vao': 49, 'mediana': 272} | `capa -> cena @1920px` |
| 145 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `cap -> retrato @1920px` |
| 146 | web | MEDIA | vao de 161px contra mediana 272px da pagina (razao 0.59) — {'vao': 161, 'mediana': 272} | `retrato -> cap @1920px` |
| 147 | web | MEDIA | vao de 137px contra mediana 272px da pagina (razao 0.50) — {'vao': 137, 'mediana': 272} | `cap -> sala @1920px` |
| 148 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `sala -> cap @1920px` |
| 149 | web | MEDIA | alvo de toque 175x42px (minimo 44 de altura) — {'sel': 'A.', 'w': 175, 'h': 42, 'txt': 'Política de privacidade'} | `A. @320px` |
| 150 | web | MEDIA | alvo de toque 270x42px (minimo 44 de altura) — {'sel': 'A.', 'w': 270, 'h': 42, 'txt': 'Política de privacidade'} | `A. @390px` |
| 151 | web | MEDIA | alvo de toque 164x18px (minimo 44 de altura) — {'sel': 'A.', 'w': 164, 'h': 18, 'txt': 'Política de privacidade'} | `A. @768px` |
| 152 | web | BAIXA | bloco largo termina em R=1004; o trilho direito e' R=1320 | `DIV.cab @1440px` |
| 153 | web | BAIXA | bloco largo termina em R=1004; o trilho direito e' R=1320 | `DIV.cab @1440px` |
| 154 | web | BAIXA | bloco largo termina em R=1004; o trilho direito e' R=1320 | `DIV.cab @1440px` |
| 155 | web | BAIXA | medida de linha 36 caracteres (alvo 45-82) — {'sel': 'manifesto', 'fs': 44, 'larg': 570, 'linhas': 4, 'cpl': 36} | `manifesto @1440px` |
| 156 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 157 | web | MEDIA | parede de texto: 1824 caracteres de prosa e nenhuma imagem na seccao — {'nome': 'cap', 'chars': 1824, 'midia': 0} | `cap @320px` |
| 158 | web | MEDIA | parede de texto: 1824 caracteres de prosa e nenhuma imagem na seccao — {'nome': 'cap', 'chars': 1824, 'midia': 0} | `cap @1920px` |
| 159 | web | MEDIA | alvo de toque 306x20px (minimo 44 de altura) — {'sel': 'A.', 'w': 306, 'h': 20, 'txt': 'contato@iesuscontabilidade'} | `A. @390px` |
| 160 | web | MEDIA | alvo de toque 306x20px (minimo 44 de altura) — {'sel': 'A.', 'w': 306, 'h': 20, 'txt': 'contato@iesuscontabilidade'} | `A. @390px` |
| 161 | web | MEDIA | alvo de toque 200x20px (minimo 44 de altura) — {'sel': 'A.', 'w': 200, 'h': 20, 'txt': 'Preferências de cookies'} | `A. @390px` |
| 162 | web | MEDIA | alvo de toque 306x20px (minimo 44 de altura) — {'sel': 'A.', 'w': 306, 'h': 20, 'txt': 'contato@iesuscontabilidade'} | `A. @768px` |
| 163 | web | MEDIA | alvo de toque 306x20px (minimo 44 de altura) — {'sel': 'A.', 'w': 306, 'h': 20, 'txt': 'contato@iesuscontabilidade'} | `A. @768px` |
| 164 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 165 | web | ALTA | texto sobre imagem: contraste 1.81 no pior caso (min 4.5) — {'texto': 'dinheiro no bolso', 'fundo_p95': [92, 194, 242]} | `SPAN.sub @320px` |
| 166 | web | MEDIA | vao de 71px contra mediana 139px da pagina (razao 0.51) — {'vao': 71, 'mediana': 139} | `topo -> cap @320px` |
| 167 | web | MEDIA | vao de 75px contra mediana 139px da pagina (razao 0.54) — {'vao': 75, 'mediana': 139} | `cap -> retrato @320px` |
| 168 | web | MEDIA | vao de 71px contra mediana 139px da pagina (razao 0.51) — {'vao': 71, 'mediana': 139} | `topo -> cap @390px` |
| 169 | web | MEDIA | vao de 75px contra mediana 139px da pagina (razao 0.54) — {'vao': 75, 'mediana': 139} | `cap -> retrato @390px` |
| 170 | web | MEDIA | vao de 76px contra mediana 148px da pagina (razao 0.51) — {'vao': 76, 'mediana': 148} | `topo -> cap @768px` |
| 171 | web | MEDIA | vao de 80px contra mediana 148px da pagina (razao 0.54) — {'vao': 80, 'mediana': 148} | `cap -> retrato @768px` |
| 172 | web | BAIXA | medida de linha 33 caracteres (alvo 45-82) — {'sel': 'citacao', 'fs': 27, 'larg': 496, 'linhas': 3, 'cpl': 33} | `citacao @1440px` |
| 173 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 174 | web | MEDIA | vao de 47px contra mediana 144px da pagina (razao 0.33) — {'vao': 47, 'mediana': 144} | `topo -> retrato @320px` |
| 175 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `retrato -> cap @320px` |
| 176 | web | MEDIA | vao de 47px contra mediana 144px da pagina (razao 0.33) — {'vao': 47, 'mediana': 144} | `topo -> retrato @390px` |
| 177 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `retrato -> cap @390px` |
| 178 | web | MEDIA | vao de 53px contra mediana 153px da pagina (razao 0.35) — {'vao': 53, 'mediana': 153} | `topo -> retrato @768px` |
| 179 | web | MEDIA | vao de 76px contra mediana 153px da pagina (razao 0.50) — {'vao': 76, 'mediana': 153} | `retrato -> cap @768px` |
| 180 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `retrato -> cap @1440px` |
| 181 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `retrato -> cap @1920px` |
| 182 | web | BAIXA | bloco largo termina em R=1004; o trilho direito e' R=1320 | `DIV.cab @1440px` |
| 183 | web | BAIXA | medida de linha 36 caracteres (alvo 45-82) — {'sel': 'manifesto', 'fs': 38, 'larg': 496, 'linhas': 4, 'cpl': 36} | `manifesto @1440px` |
| 184 | web | BAIXA | medida de linha 37 caracteres (alvo 45-82) — {'sel': 'citacao', 'fs': 27, 'larg': 560, 'linhas': 5, 'cpl': 37} | `citacao @1440px` |
| 185 | web | BAIXA | medida de linha 36 caracteres (alvo 45-82) — {'sel': 'citacao', 'fs': 27, 'larg': 560, 'linhas': 4, 'cpl': 36} | `citacao @1440px` |
| 186 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 187 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 188 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 189 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 190 | web | MEDIA | vao de 136px contra mediana 297px da pagina (razao 0.46) — {'vao': 136, 'mediana': 297} | `topo -> cap @1440px` |
| 191 | web | MEDIA | vao de 136px contra mediana 297px da pagina (razao 0.46) — {'vao': 136, 'mediana': 297} | `topo -> cap @1920px` |
| 192 | web | BAIXA | bloco largo termina em R=1004; o trilho direito e' R=1320 | `DIV.cab @1440px` |
| 193 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |
| 194 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @320px` |
| 195 | web | MEDIA | vao de 72px contra mediana 144px da pagina (razao 0.50) — {'vao': 72, 'mediana': 144} | `topo -> cap @390px` |
| 196 | web | MEDIA | vao de 77px contra mediana 153px da pagina (razao 0.50) — {'vao': 77, 'mediana': 153} | `topo -> cap @768px` |
| 197 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1440px` |
| 198 | web | MEDIA | vao de 136px contra mediana 272px da pagina (razao 0.50) — {'vao': 136, 'mediana': 272} | `topo -> cap @1920px` |
| 199 | web | ALTA | a pagina publica 2 numeros diferentes: 556230976532, 556282041641 | `contato` |

> Fase 1.1 (instrumento). A passada humana e as Fases 2 e 3 estao em
> `playbooks/auditar-entrega.md`.
