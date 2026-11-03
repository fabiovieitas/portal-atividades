# 🧪 Guia Oficial de Testes Humanos — Portal Lab Kids

Este documento reúne o passo a passo completo e detalhado para você testar manualmente, em qualquer navegador, computador, celular ou tablet, todas as novas funcionalidades implementadas no **Portal Lab Kids** (`https://labkids.online`).

---

## 📋 Índice dos Testes
1. [Teste 1: Cadastro Instantâneo de Professor](#teste-1-cadastro-instantâneo-de-professor)
2. [Teste 2: Gestão de Turmas e Projeção no Datashow](#teste-2-gestão-de-turmas-e-projeção-no-datashow)
3. [Teste 3: Aluno Acessando com Código da Turma](#teste-3-aluno-acessando-com-código-da-turma)
4. [Teste 4: Acesso Direto via Link Compartilhável](#teste-4-acesso-direto-via-link-compartilhável)
5. [Teste 5: Modo Explorador Livre (Estudante em Casa)](#teste-5-modo-explorador-livre-estudante-em-casa)
6. [Teste 6: Novo Studio de Avatares Épico](#teste-6-novo-studio-de-avatares-épico)
7. [Teste 7: Motor de Gamificação (Daily Streak, Foco e XP)](#teste-7-motor-de-gamificação-daily-streak-foco-e-xp)
8. [Teste 8: Temporizador de Inatividade (5 Minutos - Tablet Coletivo)](#teste-8-temporizador-de-inatividade-5-minutos---tablet-coletivo)
9. [Teste 9: Botão de Saída Rápida no Fim da Aula](#teste-9-botão-de-saída-rápida-no-fim-da-aula)
10. [Teste 10: Auditoria Visual dos Anúncios do AdSense](#teste-10-auditoria-visual-dos-anúncios-do-adsense)
11. [Teste 11: Baú Diário do Robô Léo (Recompensa Diária & XP)](#teste-11-baú-diário-do-robô-léo)
12. [Teste 12: Tela de Interlúdio com Anúncio AdSense (3 Segundos)](#teste-12-tela-de-interlúdio-com-anúncio-adsense-3-segundos)
13. [Teste 13: Teclado Lúdico de PIN para Tablets (1º ao 5º Ano)](#teste-13-teclado-lúdico-de-pin-para-tablets-1º-ao-5º-ano)
14. [Teste 14: Modo Prova / Foco Total (Simulado sem Distrações)](#teste-14-modo-prova--foco-total)
15. [Teste 15: Roleta da Sorte Educativa pós-simulado](#teste-15-roleta-da-sorte-educativa-pós-simulado)
16. [Teste 16: Emissão e Impressão do Certificado Oficial (PDF)](#teste-16-emissão-e-impressão-do-certificado-oficial-pdf)
17. [Teste 17: Mural de Mérito Pedagógico da Turma](#teste-17-mural-de-mérito-pedagógico-da-turma)

---

### Teste 1: Cadastro Instantâneo de Professor
- **Objetivo:** Garantir que qualquer educador do Brasil (usando Gmail, Outlook, rede estadual ou particular) consiga se cadastrar e acessar o painel imediatamente, sem bloqueio de confirmação de código.
- **Passo a passo:**
  1. Abra uma janela anônima no navegador.
  2. Acesse: `https://labkids.online/professor/login?cadastro=1`
  3. Preencha os campos com dados de teste:
     - **Nome:** Prof. Carlos Teste
     - **E-mail:** `carlos.teste.` + seu sobrenome + `@gmail.com`
     - **Escola:** E.M. Santos Dumont - São Paulo
     - **Senha:** `senha1234`
  4. Marque a caixinha da declaração pedagógica (LGPD).
  5. Clique no botão azul: **"Criar Conta e Acessar Painel 🚀"**.
- **Resultado Esperado:** 
  - Você é aprovado imediatamente (`status = approved`).
  - É redirecionado direto para `https://labkids.online/professor/dashboard?welcome=1`.
  - Uma mensagem de boas-vindas aparece no topo.

---

### Teste 2: Gestão de Turmas e Projeção no Datashow
- **Objetivo:** Verificar a criação de códigos automáticos e a projeção com QR Code gigante para sala de aula.
- **Passo a passo:**
  1. No painel do professor, clique na aba **"Turmas"** no menu lateral.
  2. Clique no botão **"+ Nova Turma"**.
  3. Preencha:
     - **Escola:** Colégio Inovação
     - **Turma:** 4º Ano Alfa
  4. Clique em **Salvar Turma**.
  5. Observe o novo card criado:
     - Deve exibir um **Código da Turma** exclusivo de 6 dígitos (ex: `LK5821`).
     - Clique em `📋 Copiar Código` e teste colar em um bloco de notas.
     - Clique em `🔗 Link Direto` e teste colar no navegador.
     - Clique no botão roxo: **"📽️ Projetar para Alunos (Datashow / QR) 🚀"**.
- **Resultado Esperado:**
  - O modal de projeção abre em tela cheia com fundo escuro cinematográfico.
  - O código aparece em tamanho gigante (legível a distância na lousa).
  - O QR Code aparece centralizado para leitura com câmera de celular ou tablet.
  - O botão `⛶ Tela Cheia` expande para o Datashow.

---

### Teste 3: Aluno Acessando com Código da Turma
- **Objetivo:** Validar o fluxo de entrada do aluno via digitação do código passado pelo professor.
- **Passo a passo:**
  1. Em outra aba anônima (ou no tablet/celular), acesse: `https://labkids.online/aluno`.
  2. No topo, localize a caixa azul: **"🔑 Tem o Código da sua Turma?"**.
  3. Digite o código gerado no Teste 2 (ex: `LK5821` ou o existente `LK4078`).
  4. Clique em **"ENTRAR NA TURMA 🚀"** (ou aperte Enter).
- **Resultado Esperado:**
  - Surge uma mensagem verde de sucesso: *"🎉 Turma encontrada: 4º Ano Alfa - Colégio Inovação"*.
  - A tela transiciona automaticamente para o Passo 3 (Escolha seu Nome / Criar Avatar) já vinculado àquela escola e turma.

---

### Teste 4: Acesso Direto via Link Compartilhável
- **Objetivo:** Testar se o aluno que clica no link enviado pelo professor cai direto na turma sem digitar nada.
- **Passo a passo:**
  1. Acesse diretamente pela URL: `https://labkids.online/aluno?turma=LK4078`
- **Resultado Esperado:**
  - O campo de código é preenchido sozinho.
  - O sistema faz a busca automática e entra direto na turma sem exigir cliques adicionais.

---

### Teste 5: Modo Explorador Livre (Estudante em Casa)
- **Objetivo:** Garantir que crianças sem escola ou estudando em casa possam jogar livremente.
- **Passo a passo:**
  1. Acesse: `https://labkids.online/aluno`.
  2. No cartão amarelo, clique no botão: **"⭐ JOGAR NO MODO LIVRE"**.
- **Resultado Esperado:**
  - O sistema pula a seleção de escola e PIN.
  - Abre diretamente o Studio de Avatares vinculado como *"Exploradores Livres - Lab Kids Brasil"*.

---

### Teste 6: Novo Studio de Avatares Épico
- **Objetivo:** Testar a nova experiência visual de criação de personagem.
- **Passo a passo:**
  1. No Studio de Avatares (`Passo 4`), observe o painel esquerdo:
     - O avatar gigante aparece com iluminação dinâmica no fundo e o crachá *"⭐ Nível 1 • Recruta Digital"*.
  2. Na aba **"🦸‍♂️ Heróis"**, clique em diferentes personagens:
     - *RoboTron 3000*, *Mago Supremo*, *Ninja das Sombras*, *Cientista Sofia*, *Gamer Lucas*, *Super Sorriso*.
     - Veja como o avatar, as cores e a sugestão de nome mudam instantaneamente!
  3. Alterne entre as abas **"🎨 Tribo"**, **"👤 Personagem"** e **"🌈 Fundo"** para customizar detalhes.
  4. Clique no botão **"🎲 Sorteio Surpresa 🚀"** para testar a roleta de combinações.
  5. Digite seu nome (ex: `Lucas Gamer`) e clique em **"✨ SALVAR MEU AVATAR 🚀"**.
- **Resultado Esperado:**
  - Seu perfil é salvo no navegador e abre o Painel do Aluno (Passo 5) com seu avatar, crachá, XP e Sequência Diária.

---

### Teste 7: Motor de Gamificação (Daily Streak, Foco e XP)
- **Objetivo:** Validar o ganho de pontos por login diário, permanência e navegação.
- **Passo a passo:**
  1. Ao salvar seu avatar ou recarregar a página, observe o canto inferior direito:
     - Deve surgir um Toast flutuante estilo Duolingo: **"🔥 SEQUÊNCIA DIÁRIA: DIA 1! +50 XP de bônus!"**.
  2. Olhe para a barra de navegação no topo de qualquer página do site:
     - Um selo brilhante aparece: `🔥 1d | ⭐ 50 XP | Recruta 1`.
  3. Navegue até o blog pedagógico (`https://labkids.online/noticias`) ou abra a página de um jogo (ex: `https://labkids.online/atividades/detetive-ortografia`):
     - Um Toast de conquista surge: **"+5 XP Conquistados! 🗺️ Explorador de Desafios"**.
  4. Permaneça na página mexendo o mouse ou clicando por 2 minutos:
     - O sistema credita automaticamente **+10 XP** por foco e tempo de estudo.

---

### Teste 8: Temporizador de Inatividade (5 Minutos - Tablet Coletivo)
- **Objetivo:** Validar o desligamento automático para evitar que um aluno use o perfil do colega no tablet compartilhado.
- **Passo a passo:**
  1. Na Área do Aluno (`/aluno`), com um perfil conectado, solte o mouse e não toque na tela.
  2. Aguarde até **4 minutos**:
     - O modal de aviso escuro surge na tela: *"⏳ Você ainda está aí? Por segurança neste tablet compartilhado, seu perfil será desconectado em 60s"*.
     - Há um cronômetro regressivo contando de `60s` até `0s`.
  3. Teste A: Clique em **"🟢 CONTINUAR JOGANDO"** para confirmar que o aviso fecha e o tempo zera.
  4. Teste B: Deixe o tempo esgotar até os **5 minutos**.
- **Resultado Esperado:**
  - Ao bater 5 minutos sem interação, surge o alerta: *"⏳ Sessão finalizada por 5 minutos de inatividade! O tablet foi liberado para o próximo colega."*.
  - O perfil é deslogado e o tablet volta para a tela inicial limpo para o próximo aluno.

---

### Teste 9: Botão de Saída Rápida no Fim da Aula
- **Objetivo:** Permitir ao aluno sair manualmente em 1 clique ao bater o sinal da aula.
- **Passo a passo:**
  1. No topo da Área do Aluno (`/aluno`), localize o botão vermelho:
     `🚪 Trocar Aluno / Finalizar Aula`.
  2. Clique nele e confirme a saída.
- **Resultado Esperado:**
  - A sessão é encerrada imediatamente e o sistema volta para a tela de escolha de turmas/código.

---

### Teste 10: Auditoria Visual dos Anúncios do AdSense
- **Objetivo:** Conferir se as posições de anúncio estão de acordo com as regras do Google AdSense.
- **Passo a passo:**
  1. Abra `/aluno` e confira o banner de topo rotulado com `"Publicidade / Apoio Educacional"`.
  2. Entre no perfil do aluno (Passo 5) e confira o banner localizado logo abaixo dos pontos.
  3. Abra um link de QR Code de teste: `https://labkids.online/qr/1`:
     - O container exibe o bloco do AdSense centralizado com contagem de 5 segundos antes de carregar o jogo.
- **Resultado Esperado:**
  - Os blocos estão visíveis, bem delimitados e identificados como publicidade (sem parecer botões falsos), atendendo 100% às políticas de conteúdo seguro para famílias.



---

### Teste 11: Baú Diário do Robô Léo
- **Objetivo:** Abrir o baú de recompensas diárias com animação, confetes e crédito imediato de XP no perfil do aluno.
- **Passo a passo:**
  1. Acesse: `https://labkids.online/aluno`
  2. Escolha o "Modo Livre" ou acesse sua turma com um perfil criado.
  3. No painel do aluno (Passo 5), localize o card dourado: **"🎁 Baú do Robô Léo"**.
  4. Toque no card para abrir o modal.
  5. Clique em **"✨ ABRIR MEU BAÚ MÁGICO 🚀"**.
- **Resultado Esperado:**
  - O baú treme, a tampa se abre com confetes coloridos e som visual.
  - Concede +75 XP (ou mais conforme o streak de dias).
  - O card passa a exibir: "Baú Diário Coletado! ✅ Volte amanhã!".

---

### Teste 12: Tela de Interlúdio com Anúncio AdSense (3 Segundos)
- **Objetivo:** Validar a transição com publicidade educativa antes do início do jogo, garantindo impressões de anúncio limpas e sem cliques acidentais.
- **Passo a passo:**
  1. Acesse qualquer atividade: `https://labkids.online/atividades/tabuada-chao-e-lava`
  2. Clique no botão principal: **"🎮 INICIAR O JOGO AGORA 🚀"**.
- **Resultado Esperado:**
  - Abre uma tela de interlúdio suave com o Robô Léo.
  - Exibe um contador regressivo (3... 2... 1...).
  - Mostra o bloco de anúncio oficial rotulado como "PUBLICIDADE EDUCATIVA".
  - Ao zerar o tempo, o botão libera e redireciona automaticamente para a atividade.

---

### Teste 13: Teclado Lúdico de PIN para Tablets (1º ao 5º Ano)
- **Objetivo:** Garantir que crianças dos anos iniciais acessem sua conta em tablets compartilhados sem digitar senhas complexas.
- **Passo a passo:**
  1. Acesse: `https://labkids.online/aluno`
  2. Entre em uma turma que possua alunos com PIN cadastrado (ou crie um aluno com senha de 4 dígitos).
  3. Toque no card do aluno na lista da turma.
- **Resultado Esperado:**
  - Em vez de um alert feio do navegador, abre o **Teclado Lúdico Infantil**.
  - O aluno vê seu avatar e 4 bolinhas brancas.
  - Ao tocar nos botões numéricos grandes (1, 2, 3, 4), as bolinhas azuis se preenchem.
  - Valida instantaneamente ao digitar o 4º dígito.

---

### Teste 14: Modo Prova / Foco Total
- **Objetivo:** Realizar avaliações escolares sem distrações, popups ou abas indesejadas.
- **Passo a passo:**
  1. Acesse: `https://labkids.online/simulado/campos-4ano-agosto-2026`
  2. No topo da página, clique no botão azul: **"🛡️ Modo Foco Total"**.
- **Resultado Esperado:**
  - A tela entra imediatamente em modo de tela cheia (Fullscreen).
  - O botão de voltar ao portal é ocultado para evitar saídas acidentais.
  - Caso o aluno tente recarregar ou sair da aba, o navegador exibe aviso de proteção.

---

### Teste 15: Roleta da Sorte Educativa pós-simulado
- **Objetivo:** Premiar os estudantes após concluírem a prova com bônus de XP.
- **Passo a passo:**
  1. No mesmo simulado de 4º ano, responda as questões e clique em **"Entregar Simulado"**.
  2. No modal de confirmação, clique em: **"🎡 Girar Roleta (+XP)"**.
  3. No modal da roleta, clique em **"GIRAR A ROLETA AGORA!"**.
- **Resultado Esperado:**
  - A roleta em HTML5 Canvas gira em alta velocidade por 3.5 segundos e desacelera suavemente.
  - O ponteiro indica o prêmio sorteado (+50 XP, +100 XP, etc.).
  - Os pontos são somados imediatamente ao perfil de gamificação do aluno!

---

### Teste 16: Emissão e Impressão do Certificado Oficial (PDF)
- **Objetivo:** Gerar o diploma escolar em alta resolução para levar para casa.
- **Passo a passo:**
  1. No modal de resultado do simulado, clique no botão: **"📜 Baixar Certificado"**.
- **Resultado Esperado:**
  - Abre o diploma oficial em moldura dourada dupla com selo de Honra ao Mérito.
  - Preenche automaticamente o nome do aluno, turma, escola e assinatura do Prof. Fábio.
  - O botão **"🖨️ Imprimir / Salvar em PDF"** aciona a impressão formatada em formato paisagem (A4).

---

### Teste 17: Mural de Mérito Pedagógico da Turma
- **Objetivo:** Reconhecer o esforço dos alunos de forma tranquila e acolhedora, sem barulhos estridentes.
- **Passo a passo:**
  1. Acesse `https://labkids.online/aluno` com qualquer perfil ativo.
  2. Role até a área de conquistas no Passo 5.
- **Resultado Esperado:**
  - O bloco **"🌟 Mural de Mérito da Turma"** apresenta distintivos de honra:
    - 📚 *Guardião da Leitura*
    - 🔥 *Campeão da Constância*
    - ⏱️ *Foco de Ouro*
  - Mensagem pedagógica incentivadora sem gerar ansiedade ou barulho tóxico.
