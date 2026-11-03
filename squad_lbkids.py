"""
=============================================================================
SQUAD 3: SUPER SQUAD PORTAL LBKIDS (squad_lbkids.py)
Workspace: Desktop\\Super Gerador\\portal-atividades-lab
=============================================================================
Equipe de Agentes Especialistas:
- Agente 1: Arquiteto Backend & DB (Express, SQLite, Turso, Supabase, Rotas)
- Agente 2: Pedagogo Infantil (BNCC, Simulados 1º ao 5º Ano, Didática)
- Agente 3: Engenheiro Frontend & Gamificação (EJS, Canvas, Áudio, Avatares, XP)
- Agente 4: Diretor de Arte (FLUX.1, Prompts Visuais, Ilustrações)
- Agente 5: Engenheiro Mobile Android (Responsividade, WebView, Capacitor/APK)
=============================================================================
"""

import os
import sys
import json
import urllib.request
import urllib.error

FREE_LLM_URL = os.getenv("FREE_LLM_API_URL", "http://localhost:3001/v1/chat/completions")
MODEL_DEFAULT = os.getenv("FREE_LLM_MODEL", "qwen-2.5-coder")

AGENTS = {
    "1": {
        "role": "Arquiteto Backend & DB",
        "icon": "🛡️",
        "system": (
            "Você é o Arquiteto Backend do Portal Lab Kids. Especialista em Node.js/Express, "
            "SQLite, Turso Cloud e Supabase. Você projeta rotas seguras, APIs de alunos e turmas, "
            "e mantém alta performance sem loops de polling."
        )
    },
    "2": {
        "role": "Pedagogo Infantil",
        "icon": "📚",
        "system": (
            "Você é o Pedagogo Infantil do Portal Lab Kids. Especialista em BNCC (1º ao 5º ano do Ensino Fundamental), "
            "simulados interativos, progressão de habilidades, desafios de cálculo mental e alfabetização lúdica."
        )
    },
    "3": {
        "role": "Engenheiro Frontend & Gamificação",
        "icon": "🎮",
        "system": (
            "Você é o Engenheiro Frontend & Gamificação do Portal Lab Kids. Especialista em interfaces vibrantes para crianças, "
            "sistemas de avatar no estilo Duolingo (DiceBear), efeitos sonoros via Web Audio API, partículas e animações CSS fluidas."
        )
    },
    "4": {
        "role": "Diretor de Arte (FLUX.1)",
        "icon": "🎨",
        "system": (
            "Você é o Diretor de Arte do Portal Lab Kids. Cria prompts cinematográficos e didáticos para capas de jogos infantis "
            "e aciona geradores visuais (FLUX.1) sem textos aleatórios ou deformidades."
        )
    },
    "5": {
        "role": "Engenheiro Mobile Android",
        "icon": "📱",
        "system": (
            "Você é o Engenheiro Mobile Android do Portal Lab Kids. Garante suporte a tablets compartilhados na sala de aula, "
            "responsividade touch-friendly, detecção de inatividade e compatibilidade com WebView/Android APK."
        )
    }
}

def query_agent(agent_id, user_prompt):
    agent = AGENTS.get(agent_id, AGENTS["3"])
    payload = {
        "model": MODEL_DEFAULT,
        "messages": [
            {"role": "system", "content": agent["system"]},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1500
    }

    req = urllib.request.Request(
        FREE_LLM_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": "Bearer local"}
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"[Erro ao conectar com FreeLLMAPI em {FREE_LLM_URL}: {e}]"

def main():
    print("=" * 65)
    print("🎨 SUPER SQUAD PORTAL LAB KIDS INICIADO (FreeLLMAPI)")
    print("=" * 65)
    for k, v in AGENTS.items():
        print(f"[{k}] {v['icon']} {v['role']}")
    print("=" * 65)

    if len(sys.argv) > 2:
        aid = sys.argv[1]
        prompt = " ".join(sys.argv[2:])
        print(f"\nDisparando Agente [{aid}]: {AGENTS.get(aid, {}).get('role')}")
        ans = query_agent(aid, prompt)
        print("\nResposta do Agente:\n")
        print(ans)
    else:
        print("Uso: python squad_lbkids.py <numero_do_agente> <sua instrucao>")

if __name__ == "__main__":
    main()
