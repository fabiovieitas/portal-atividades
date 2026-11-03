"""
=============================================================================
🎨 SUPER SQUAD PORTAL LBKIDS (squad_lbkids.py)
Workspace: Desktop\\Super Gerador\\portal-atividades-lab
=============================================================================
Squad Multi-Agente Oficial:
- Agente 1: Arquiteto Backend & DB (Node.js, Express, Turso Cloud, SQLite)
- Agente 2: Pedagogo Infantil (BNCC 1º ao 5º Ano, Simulados, Didática)
- Agente 3: Engenheiro Frontend & Gamificação (EJS, Canvas, Avatares, XP, Áudio)
- Agente 4: Diretor de Arte (FLUX.1, Prompts Visuais, Capas)
- Agente 5: Engenheiro Mobile Android (Capacitor, Tablets Escolares, Responsividade)
=============================================================================
"""

import os
import sys
import json
import warnings
import urllib.request
import urllib.error

# Força codificação UTF-8 no Windows Console para emojis e caracteres acentuados
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

warnings.filterwarnings("ignore")
os.environ["OTEL_SDK_DISABLED"] = "true"
os.environ["CREWAI_TELEMETRY_OPT_OUT"] = "true"

FREELLM_URL = os.getenv("FREELLMAPI_URL", "http://127.0.0.1:3001/v1")
FREELLM_KEY = os.getenv("FREELLMAPI_KEY", "freellmapi-0af93b3a0e1cbe45a5785fd84071080555fc11b147d6f7f2")

def test_freellm_connection():
    try:
        req = urllib.request.Request(
            f"{FREELLM_URL}/models",
            headers={"Authorization": f"Bearer {FREELLM_KEY}"}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return True, f"Online ({len(data.get('data', []))} modelos locais ativos)"
    except Exception as e:
        return False, f"Alerta ({e})"

try:
    from crewai import Agent, Task, Crew, Process, LLM

    def get_coder_llm():
        return LLM(
            model="openai/claude-sonnet-4-5",
            base_url=FREELLM_URL,
            api_key=FREELLM_KEY,
            temperature=0.1
        )

    def get_writer_llm():
        return LLM(
            model="openai/claude-sonnet-4-5",
            base_url=FREELLM_URL,
            api_key=FREELLM_KEY,
            temperature=0.3
        )

    def get_fast_llm():
        return LLM(
            model="openai/auto",
            base_url=FREELLM_URL,
            api_key=FREELLM_KEY,
            temperature=0.4
        )

    def criar_squad_lbkids():
        coder_llm = get_coder_llm()
        writer_llm = get_writer_llm()
        fast_llm = get_fast_llm()

        # 1. Arquiteto Backend & Banco de Dados
        db_architect = Agent(
            role="Arquiteto de Banco de Dados e Backend Node.js",
            goal="Desenvolver rotas Express seguras, esquemas SQLite/Turso/Supabase para turmas, simulados, pontuações e envios de email",
            backstory="Engenheiro backend com domínio do ecossistema Node/Express, banco de dados relacional e compliance de segurança infantil.",
            llm=coder_llm,
            verbose=False
        )

        # 2. Pedagogo Infantil
        pedagogo = Agent(
            role="Pedagogo Infantil e Coordenador de Conteúdo BNCC",
            goal="Elaborar simulados por turma/ano escolar (1º ao 5º ano), cartas enigmáticas e regras lúdicas de pontuação",
            backstory="Especialista em psicopedagogia e desenvolvimento infantil com foco em metodologias ativas de aprendizagem e BNCC.",
            llm=writer_llm,
            verbose=False
        )

        # 3. Engenheiro Frontend Web & Gamificação
        dev_frontend = Agent(
            role="Desenvolvedor Frontend Web e Gamificação",
            goal="Construir telas responsivas, jogos em HTML5 Canvas/EJS/React, studio de avatares estilo Duolingo e dashboards",
            backstory="Engenheiro frontend apaixonado por interfaces infantis fluidas, acessíveis e jogos educativos no navegador.",
            llm=coder_llm,
            verbose=False
        )

        # 4. Diretor de Arte (FLUX.1)
        diretor_arte = Agent(
            role="Diretor de Arte Infantil e Prompter FLUX.1",
            goal="Criar prompts em inglês sob medida para gerar ilustrações infantis, personagens e capas de jogos com FLUX.1",
            backstory="Ilustrador sênior focado em estética infantil moderna (estilo Pixar, 3D vibrante e traços nítidos).",
            llm=writer_llm,
            verbose=False
        )

        # 5. Engenheiro Mobile Android
        dev_mobile = Agent(
            role="Engenheiro Mobile Android",
            goal="Garantir que o portal funcione perfeitamente como aplicativo Android nativo, responsivo e com suporte offline e tablets coletivos",
            backstory="Desenvolvedor mobile especializado em empacotamento Android (Capacitor/WebView) e performance em tablets de sala de aula.",
            llm=fast_llm,
            verbose=False
        )

        return [db_architect, pedagogo, dev_frontend, diretor_arte, dev_mobile]

    def executar_squad_lbkids(demanda: str) -> str:
        agentes = criar_squad_lbkids()
        backend, pedagogo, frontend, arte, mobile = agentes

        t1 = Task(
            description=f"Elabore os requisitos pedagógicos para a demanda do lbkids: '{demanda}'. Defina ano escolar, habilidades BNCC e regras lúdicas.",
            expected_output="Especificação pedagógica completa da atividade ou melhoria.",
            agent=pedagogo
        )
        t2 = Task(
            description="Especifique a arquitetura técnica, rotas necessárias no server.js e tabelas no Turso/SQLite.",
            expected_output="Código de queries SQL e rotas Express prontas para inserção.",
            agent=backend
        )
        t3 = Task(
            description="Construa o código da tela interativa, componentes EJS/JS, sistema de avatares e gamificação XP.",
            expected_output="Código dos componentes de interface e regras de gamificação.",
            agent=frontend
        )

        equipe = Crew(
            agents=[pedagogo, backend, frontend],
            tasks=[t1, t2, t3],
            process=Process.sequential,
            verbose=True
        )
        return str(equipe.kickoff())

except Exception as ex:
    criar_squad_lbkids = None
    executar_squad_lbkids = None

def main():
    print("=" * 70)
    print("  🎨 SUPER SQUAD PORTAL LBKIDS (SQUAD 3) — ATIVO")
    print("=" * 70)
    
    online, msg = test_freellm_connection()
    status_icon = "🟢" if online else "🟡"
    print(f"  {status_icon} FreeLLMAPI Local: {FREELLM_URL} -> {msg}")
    print("  ⚡ Modo de Operação: Cota R$ 0 (Modelos Locais Qwen / Claude Sonnet / FLUX)")
    print("-" * 70)
    print("  👥 AGENTES ESPECIALISTAS INTEGRADOS:")
    print("  [1] 🛡️  Arquiteto Backend & DB        (Express, Turso Cloud, SQLite, APIs)")
    print("  [2] 📚  Pedagogo Infantil             (BNCC 1º-5º Ano, Simulados, Didática)")
    print("  [3] 🎮  Frontend & Gamificação        (EJS, Canvas, Studio Duolingo, XP)")
    print("  [4] 🎨  Diretor de Arte FLUX.1        (Capas 3D Pixar, Prompts Visuais)")
    print("  [5] 📱  Engenheiro Mobile Android     (Tablets, WebView, Responsividade)")
    print("=" * 70)

    if len(sys.argv) > 1:
        demanda = " ".join(sys.argv[1:])
        print(f"\n🚀 Disparando Missão do Squad para: '{demanda}'\n")
        if executar_squad_lbkids:
            resultado = executar_squad_lbkids(demanda)
            print("\n" + "=" * 70)
            print("🏁 RESULTADO DO SQUAD:")
            print("=" * 70)
            print(resultado)
        else:
            print("[Aviso] CrewAI não encontrado para execução encadeada.")
    else:
        print("\n✨ Status: Todos os 5 agentes estão prontos e integrados ao projeto!")
        print("💡 Para despachar uma tarefa em cadeia para o Squad, execute:")
        print("   python squad_lbkids.py \"sua demanda aqui\"")
        print("=" * 70)

if __name__ == "__main__":
    main()
