const game = {
    player: {
        name: "",
        gear: "🛡️",
        gearName: "Escudo Digital",
        avatar: "assets/avatar1.png"
    },
    stats: {
        empathy: 60,
        digital: 60,
        xp: 0
    },
    achievements: [],
    currentStep: 0,
    shuffledScenarios: [],
    history: [],
    
    milestones: {
        5: { empathy: 30, digital: 30 },
        10: { empathy: 45, digital: 45 },
        15: { empathy: 60, digital: 60 }
    },

    allScenarios: [
        {
            title: "O Grupo de Elite",
            text: "Um grupo no Discord está postando fotos alteradas por IA de uma colega para ridicularizá-la. Você foi convidado para o grupo.",
            bg: "assets/chat.png",
            choices: [
                { label: "A", text: "Sair do grupo e denunciar o link para a coordenação.", impact: { empathy: +20, digital: +15, xp: 50 }, feedback: "Ação Heróica! Você escolheu o que é certo." },
                { label: "B", text: "Ficar no grupo para 'ver o que acontece' sem postar nada.", impact: { empathy: -30, digital: -10, xp: 10 }, feedback: "Omissão. Seu silêncio é interpretado como apoio pelos agressores." },
                { label: "C", text: "Postar uma figurinha rindo para ganhar moral com o grupo.", impact: { empathy: -100, digital: -100, xp: 0 }, instantGameOver: true, feedback: "CONSEQUÊNCIA FATAL: Você se tornou um agressor. Participar de intimidação sistemática é crime sob a Lei 13.185/2015." }
            ]
        },
        {
            title: "Rumores no Corredor",
            text: "Você ouve um boato pesado sobre a orientação sexual de um aluno novo. As pessoas estão rindo alto perto dele.",
            bg: "assets/hallway.png",
            choices: [
                { label: "A", text: "Mudar de assunto e puxar conversa com o aluno novo.", impact: { empathy: +25, digital: 0, xp: 60 }, feedback: "Inclusão! Um gesto seu mudou o dia de alguém." },
                { label: "B", text: "Sair de perto para não se envolver.", impact: { empathy: -15, digital: 0, xp: 5 }, feedback: "Você se protegeu, mas deixou o colega vulnerável." },
                { label: "C", text: "Aumentar o boato inventando mais uma mentira.", impact: { empathy: -100, digital: -100, xp: 0 }, instantGameOver: true, feedback: "CONSEQUÊNCIA FATAL: Calúnia e Difamação não são brincadeiras. No mundo real, isso gera processos criminais." }
            ]
        },
        {
            title: "O Post Viral",
            text: "Alguém postou um vídeo de uma briga e marcou a escola. Os comentários incentivam mais violência.",
            bg: "assets/feed.png",
            choices: [
                { label: "A", text: "Denunciar o post por discurso de ódio.", impact: { empathy: +10, digital: +20, xp: 50 }, feedback: "Cidadão Digital! Você usou as ferramentas do sistema para o bem." },
                { label: "B", text: "Marcar mais amigos para verem a 'treta'.", impact: { empathy: -40, digital: -20, xp: 5 }, feedback: "Agitador. Você transformou a dor em entretenimento." },
                { label: "C", text: "Comentar pedindo para pararem.", impact: { empathy: +15, digital: +5, xp: 30 }, feedback: "Voz da Razão. Posicionamento gera respeito real." }
            ]
        },
        {
            title: "O Desafio Perigoso",
            text: "Um desafio viral consiste em invadir áreas restritas da escola. Te pressionam a participar.",
            bg: "assets/hallway.png",
            choices: [
                { label: "A", text: "Negar e avisar sobre os riscos de expulsão.", impact: { empathy: 0, digital: +20, xp: 40 }, feedback: "Consciência. Você evitou um problema grave para todos." },
                { label: "B", text: "Ir junto apenas para filmar.", impact: { empathy: -10, digital: -30, xp: 15 }, feedback: "Cúmplice. No Jogo da Vida, quem filma o erro é tão responsável quanto quem o comete." },
                { label: "C", text: "Liderar a invasão para ganhar seguidores.", impact: { empathy: -50, digital: -100, xp: 0 }, instantGameOver: true, feedback: "CONSEQUÊNCIA FATAL: Vandalismo e invasão são atos graves. Você foi expulso do sistema escolar." }
            ]
        },
        {
            title: "O Cancelamento",
            text: "Uma amiga cometeu um erro e a escola toda está 'cancelando' ela online. Pedem para você se afastar.",
            bg: "assets/chat.png",
            choices: [
                { label: "A", text: "Ficar ao lado dela publicamente.", impact: { empathy: +40, digital: 0, xp: 70 }, feedback: "Lealdade! Você enfrentou a massa por uma amizade real." },
                { label: "B", text: "Falar com ela só no privado.", impact: { empathy: +10, digital: 0, xp: 20 }, feedback: "Amizade Frágil. O medo de ser cancelado te impediu de agir totalmente." },
                { label: "C", text: "Atacar ela nos comentários para ganhar likes.", impact: { empathy: -100, digital: -100, xp: 0 }, instantGameOver: true, feedback: "CONSEQUÊNCIA FATAL: A covardia digital deixa marcas permanentes. Você perdeu sua humanidade." }
            ]
        },
        {
            title: "O Segredo Vazado",
            text: "Um 'print' de uma conversa íntima de um colega caiu no grupo. O assunto está fervendo.",
            bg: "assets/chat.png",
            choices: [
                { label: "A", text: "Avisar o colega e pedir para ele denunciar.", impact: { empathy: +20, digital: +20, xp: 50 }, feedback: "Protetor! Você agiu com inteligência e empatia." },
                { label: "B", text: "Salvar o print para mostrar depois.", impact: { empathy: -60, digital: -40, xp: 5 }, feedback: "Vazamento. Compartilhar conteúdo privado é crime." },
                { label: "C", text: "Ignorar e apagar o print.", impact: { empathy: +10, digital: +10, xp: 30 }, feedback: "Postura Ética. Você decidiu não ser parte da cadeia de humilhação." }
            ]
        },
        {
            title: "O Aluno 'Diferente'",
            text: "Um aluno com necessidades especiais é alvo de piadas constantes no intervalo.",
            bg: "assets/hallway.png",
            choices: [
                { label: "A", text: "Convidar ele para lanchar com você.", impact: { empathy: +30, digital: 0, xp: 60 }, feedback: "Inclusão! A empatia é o Level Up mais nobre que existe." },
                { label: "B", text: "Rir baixo para os agressores acharem você 'legal'.", impact: { empathy: -70, digital: 0, xp: 5 }, feedback: "Conivência. Você ajudou a destruir alguém por um sorriso falso." },
                { label: "C", text: "Relatar a situação anonimamente.", impact: { empathy: +20, digital: 0, xp: 40 }, feedback: "Aliado Silencioso. Você usou o sistema para proteger quem precisa." }
            ]
        },
        {
            title: "A Senha do Amigo",
            text: "Você descobriu a senha do Instagram do seu melhor amigo. Bateu a curiosidade.",
            bg: "assets/feed.png",
            choices: [
                { label: "A", text: "Avisar ele para trocar a senha.", impact: { empathy: +15, digital: +20, xp: 40 }, feedback: "Integridade! Honestidade é a base de qualquer conexão real." },
                { label: "B", text: "Entrar só para ler as mensagens.", impact: { empathy: -50, digital: -50, xp: 10 }, feedback: "Invasão. Privacidade é um direito. Você quebrou a confiança." },
                { label: "C", text: "Mudar a senha dele como 'trollagem'.", impact: { empathy: -30, digital: -100, xp: 0 }, instantGameOver: true, feedback: "CONSEQUÊNCIA FATAL: Invasão de dispositivo é crime. Respeite os limites alheios." }
            ]
        },
        {
            title: "Fake News Escolar",
            text: "Estão espalhando um boato falso sobre um professor ser demitido.",
            bg: "assets/feed.png",
            choices: [
                { label: "A", text: "Desmentir o boato nos grupos.", impact: { empathy: +20, digital: +20, xp: 50 }, feedback: "Guerreiro da Verdade! Combater desinformação exige coragem." },
                { label: "B", text: "Ficar quieto, afinal 'não é comigo'.", impact: { empathy: 0, digital: 0, xp: 5 }, feedback: "Passividade. O silêncio permite que a mentira destrua carreiras." },
                { label: "C", text: "Compartilhar dizendo: 'Eita, será que é real?'.", impact: { empathy: -30, digital: -30, xp: 10 }, feedback: "Fomentador. Quem compartilha sem checar é responsável pelo estrago." }
            ]
        },
        {
            title: "Foto no Vestiário",
            text: "Tiraram uma foto de um colega trocando de roupa e jogaram no grupo.",
            bg: "assets/chat.png",
            choices: [
                { label: "A", text: "Denunciar o grupo e avisar a direção.", impact: { empathy: +40, digital: +30, xp: 80 }, feedback: "Herói Real. Você parou um crime grave de exposição íntima." },
                { label: "B", text: "Ver a foto mas não comentar nada.", impact: { empathy: -60, digital: -30, xp: 10 }, feedback: "Voyeurismo. Ver conteúdo ilegal sem agir também é uma falha ética grave." },
                { label: "C", text: "Salvar a foto e fazer figurinhas.", impact: { empathy: -200, digital: -100, xp: 0 }, instantGameOver: true, feedback: "CONSEQUÊNCIA FATAL: Isso é Crime Sexual. A lei será implacável." }
            ]
        }
    ],

    setup: function() {
        const content = document.getElementById('game-content');
        content.innerHTML = `
            <div class="screen setup-screen">
                <h1 class="pixel-font">PERFIL DO HERÓI</h1>
                <div class="rpg-box wide-box">
                    <p style="font-size: 1.3rem; margin-bottom: 20px;">Como te chamaremos na rede?</p>
                    <input type="text" id="p-name" placeholder="Nome do Jogador" class="rpg-input">
                    
                    <p style="font-size: 1.3rem; margin: 30px 0 20px 0;">Seu Avatar:</p>
                    <div class="avatar-grid">
                        <div class="avatar-opt" onclick="game.selectAvatar(this, 'assets/avatar1.png')">
                            <img src="assets/avatar1.png" alt="Avatar 1">
                        </div>
                        <div class="avatar-opt" onclick="game.selectAvatar(this, 'assets/avatar2.png')">
                            <img src="assets/avatar2.png" alt="Avatar 2">
                        </div>
                        <div class="avatar-opt" onclick="game.selectAvatar(this, 'assets/avatar3.png')">
                            <img src="assets/avatar3.png" alt="Avatar 3">
                        </div>
                        <div class="avatar-opt" onclick="game.selectAvatar(this, 'assets/avatar4.png')">
                            <img src="assets/avatar4.png" alt="Avatar 4">
                        </div>
                    </div>

                    <p style="font-size: 1.3rem; margin: 30px 0 20px 0;">Ferramenta Digital:</p>
                    <div class="gear-selector">
                        <div class="gear-opt" onclick="game.selectGear(this, '🎧', 'Fone Gamer')">🎧<br><span>Fone</span></div>
                        <div class="gear-opt" onclick="game.selectGear(this, '🖱️', 'Mouse Pro')">🖱️<br><span>Mouse</span></div>
                        <div class="gear-opt" onclick="game.selectGear(this, '🕶️', 'Holo-Lens')">🕶️<br><span>Lentes</span></div>
                        <div class="gear-opt" onclick="game.selectGear(this, '📱', 'Super Phone')">📱<br><span>Phone</span></div>
                    </div>
                </div>
                <button onclick="game.startJourney()" class="btn-rpg-start">CONECTAR E INICIAR</button>
            </div>
        `;
    },

    selectAvatar: function(el, path) {
        document.querySelectorAll('.avatar-opt').forEach(opt => opt.classList.remove('selected'));
        el.classList.add('selected');
        this.player.avatar = path;
        this.playSound('click');
    },

    selectGear: function(el, icon, name) {
        document.querySelectorAll('.gear-opt').forEach(opt => opt.classList.remove('selected'));
        el.classList.add('selected');
        this.player.gear = icon;
        this.player.gearName = name;
        this.playSound('click');
    },

    startJourney: function() {
        this.player.name = document.getElementById('p-name').value || "Herói Digital";
        if (!this.player.avatar) this.player.avatar = 'assets/avatar1.png';
        this.stats = { empathy: 60, digital: 60, xp: 0 };
        this.achievements = [];
        this.currentStep = 0;
        this.shuffledScenarios = [...this.allScenarios].sort(() => Math.random() - 0.5).slice(0, 15);
        this.updateUI();
        this.showScenario();
    },

    updateUI: function() {
        document.getElementById('empathy-val').innerText = Math.round(this.stats.empathy);
        document.getElementById('digital-val').innerText = Math.round(this.stats.digital);
        document.getElementById('empathy-bar').style.width = Math.max(0, Math.min(100, this.stats.empathy)) + '%';
        document.getElementById('digital-bar').style.width = Math.max(0, Math.min(100, this.stats.digital)) + '%';
        
        // Avatar visual feedback
        const avatarImg = document.querySelector('.avatar-display img');
        if (avatarImg) {
            if (this.stats.empathy <= 30) avatarImg.classList.add('avatar-sad');
            else avatarImg.classList.remove('avatar-sad');
            
            if (this.stats.empathy >= 90) avatarImg.classList.add('avatar-hero-glow');
            else avatarImg.classList.remove('avatar-hero-glow');
        }

        if (this.stats.empathy <= 0 || this.stats.digital <= 0) {
            this.showGameOver(`${this.player.name}, o seu sistema de ética entrou em colapso.`);
        }
    },

    showRules: function() {
        const content = document.getElementById('game-content');
        content.innerHTML = `
            <div class="screen rules-screen">
                <h1 class="pixel-font" style="font-size: 1.5rem;">CÓDIGO DE CONDUTA</h1>
                <div class="rpg-box wide-box" style="text-align: left; font-size: 1.2rem;">
                    <p>• <strong>Empatia:</strong> Sua bateria humana. O bullying a descarrega.</p>
                    <p>• <strong>Consciência:</strong> Seu firewall contra crimes digitais.</p>
                    <p>• <strong>Conquistas:</strong> Ganhe medalhas por atos heróicos.</p>
                    <p>• <strong>Impacto:</strong> A tela vai tremer quando o perigo for real.</p>
                </div>
                <button onclick="game.setup()" class="btn-rpg-start">VAMOS CRIAR O HERÓI</button>
            </div>
        `;
    },

    showScenario: function() {
        const scenario = this.shuffledScenarios[this.currentStep];
        const content = document.getElementById('game-content');
        document.getElementById('background-layer').style.backgroundImage = `url('${scenario.bg}')`;

        let choicesHtml = scenario.choices.map((choice, index) => `
            <button class="btn-rpg-choice" onclick="game.makeChoice(${index})">
                <span class="choice-label">${choice.label}</span>
                <span class="choice-text">${choice.text}</span>
            </button>
        `).join('');

        content.innerHTML = `
            <div class="screen scenario-screen">
                <div class="game-header">
                    <div class="avatar-display">
                        <img src="${this.player.avatar}" alt="Avatar">
                        <div class="player-label">${this.player.gear} ${this.player.name}</div>
                    </div>
                    <div class="progress-indicator">Missão ${this.currentStep + 1} de ${this.shuffledScenarios.length}</div>
                </div>
                <div class="rpg-box dialog-box ${this.currentStep % 3 === 0 ? 'glitch' : ''}" data-text="${scenario.title}">
                    <h2 class="res-title">${scenario.title}</h2>
                    <p>${scenario.text}</p>
                </div>
                <div class="choice-list wide-list">
                    ${choicesHtml}
                </div>
            </div>
        `;
        this.updateUI();
    },

    makeChoice: function(index) {
        const scenario = this.shuffledScenarios[this.currentStep];
        const choice = scenario.choices[index];
        
        if (choice.instantGameOver) {
            this.playSound('error');
            this.triggerShake();
            this.showGameOver(choice.feedback);
            return;
        }

        if (choice.impact.empathy > 15) {
            this.unlockAchievement("🌟 Diplomata Digital");
        }

        this.playSound('click');
        for (let stat in choice.impact) {
            this.stats[stat] += choice.impact[stat];
        }
        
        this.updateUI();
        if (this.stats.empathy > 0 && this.stats.digital > 0) {
            this.showFeedback(choice.feedback, choice.impact);
        }
    },

    unlockAchievement: function(name) {
        if (!this.achievements.includes(name)) {
            this.achievements.push(name);
            const toast = document.getElementById('achievement-toast');
            toast.innerHTML = `🏆 CONQUISTA DESBLOQUEADA:<br><strong>${name}</strong>`;
            toast.style.display = 'block';
            this.playSound('success');
            setTimeout(() => toast.style.display = 'none', 3000);
        }
    },

    playSound: function(type) {
        // Simulação de som via vibração ou feedback visual se áudio não puder carregar
        console.log(`Playing sound: ${type}`);
    },

    triggerShake: function() {
        const gameWrapper = document.getElementById('game-wrapper');
        gameWrapper.classList.add('shake');
        setTimeout(() => gameWrapper.classList.remove('shake'), 500);
    },

    showFeedback: function(text, impact) {
        const content = document.getElementById('game-content');
        const isLast = this.currentStep === this.shuffledScenarios.length - 1;

        content.innerHTML = `
            <div class="screen">
                <div class="rpg-box dialog-box">
                    <h2 class="res-title">SISTEMA ATUALIZADO</h2>
                    <p>${text}</p>
                    <div class="impact-reveal">Status de ${this.player.name}: ${this.formatImpact(impact)}</div>
                </div>
                <button onclick="game.checkProgression()" class="btn-rpg-start">
                    ${isLast ? 'RECEBER RELATÓRIO' : 'PRÓXIMO NÍVEL'}
                </button>
            </div>
        `;
    },

    formatImpact: function(impact) {
        let parts = [];
        if (impact.empathy) parts.push(`${impact.empathy > 0 ? '+' : ''}${impact.empathy} ❤️`);
        if (impact.digital) parts.push(`${impact.digital > 0 ? '+' : ''}${impact.digital} 🛡️`);
        return parts.join(' | ');
    },

    checkProgression: function() {
        const stepNum = this.currentStep + 1;
        const req = this.milestones[stepNum];
        
        if (req && (this.stats.empathy < req.empathy || this.stats.digital < req.digital)) {
            this.triggerShake();
            this.showGameOver(`Bloqueio de Segurança! Suas métricas éticas estão baixas demais.`);
            return;
        }

        if (this.currentStep < this.shuffledScenarios.length - 1) {
            this.currentStep++;
            this.showScenario();
        } else {
            this.finish();
        }
    },

    showGameOver: function(msg) {
        const gameWrapper = document.getElementById('game-wrapper');
        gameWrapper.classList.add('corrupted-screen');

        const content = document.getElementById('game-content');
        content.innerHTML = `
            <div class="screen game-over-screen">
                <h1 class="pixel-font corrupted-text" style="color: var(--danger); font-size: 3rem;">SISTEMA CORROMPIDO</h1>
                <div class="rpg-box wide-box" style="border-color: var(--danger); background: rgba(0,0,0,0.95);">
                    <p style="color: #ff7675; font-weight: bold; font-size: 1.5rem;" class="corrupted-text">${msg}</p>
                    <hr style="border: 0; border-top: 2px solid #444; margin: 25px 0;">
                    <p style="text-align: left; font-size: 1rem; color: #fff; line-height: 1.5;">
                        <strong style="color: var(--danger);">RELATÓRIO DE ERRO FATAL:</strong><br><br>
                        <strong>Lei 13.185/2015:</strong> Você falhou em manter a rede segura.<br>
                        <strong>Código Penal Brasileiro:</strong> Atos digitais são rastreáveis e puníveis.<br><br>
                        <em>A vida real não tem reset, ${this.player.name}. Suas escolhas agora fazem parte da sua história.</em>
                    </p>
                </div>
                <button onclick="window.location.reload()" class="btn-rpg-start" style="background: var(--danger); font-size: 1.2rem;">REBOOT SISTEMA (TENTAR NOVAMENTE)</button>
            </div>
        `;
    },


    finish: function() {
        const content = document.getElementById('game-content');
        let title = this.stats.empathy >= 85 ? "LENDÁRIO GUARDIÃO DA ÉTICA" : "SOBREVIVENTE CONSCIENTE";
        
        content.innerHTML = `
            <div class="screen report-screen">
                <h1 class="pixel-font" style="font-size: 2rem;">MISSÃO CONCLUÍDA</h1>
                <div class="rpg-box wide-box">
                    <div class="avatar-display" style="margin-bottom: 20px;">
                        <img src="${this.player.avatar}" alt="Avatar" style="width: 150px; height: 150px; border: 5px solid var(--success);">
                    </div>
                    <h2 class="title-reveal">${title}</h2>
                    <p class="desc-reveal">Impressionante, ${this.player.name}! Sua jornada mostra que o respeito é sua maior habilidade.</p>
                    <div class="final-stats">
                        <div class="stat-res" style="font-size: 1.3rem;">❤️ Empatia: ${Math.round(this.stats.empathy)}%</div>
                        <div class="stat-res" style="font-size: 1.3rem;">🛡️ Consciência: ${Math.round(this.stats.digital)}%</div>
                    </div>
                    <div class="achievements-list">
                        ${this.achievements.length > 0 ? "🏆 Conquistas: " + this.achievements.join(", ") : ""}
                    </div>
                </div>
                <button onclick="window.location.reload()" class="btn-rpg-start">RECONECTAR PARA NOVA JORNADA</button>
            </div>
        `;
    }
};
