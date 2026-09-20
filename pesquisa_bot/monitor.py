"""
Bot de Monitoramento Automático de Preços - Mercado Livre & Shopee.
Autor: Especialista em Automação e Web Scraping
Versão: 1.0.0
"""

import argparse
import csv
from datetime import datetime, date, timedelta
import json
import logging
import os
from pathlib import Path
import re
from typing import Dict, Any, List, Optional, Tuple

import requests
from dotenv import load_dotenv

# Importa scrapers customizados
from scrapers import MercadoLivreScraper, ShopeeScraper, ScrapedItem

# Configuração de Backend sem interface gráfica para o Matplotlib (essencial no GitHub Actions / Servidores)
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# Carrega variáveis de ambiente do arquivo .env local (se existir)
load_dotenv()

# Configuração de Logging com formato limpo e legível
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("MonitorPrecos")

# Diretórios e caminhos padrão do projeto
BASE_DIR = Path(__file__).resolve().parent
CONFIG_FILE = BASE_DIR / "config.json"
HISTORICO_CSV = BASE_DIR / "historico_precos.csv"
GRAFICOS_DIR = BASE_DIR / "graficos"
GRAFICO_PADRAO = BASE_DIR / "grafico_precos.png"

# Credenciais do Telegram obtidas via variáveis de ambiente
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()


def slugify(texto: str) -> str:
    """Gera uma versão segura de texto para nome de arquivo."""
    texto = texto.lower()
    texto = re.sub(r"[^\w\s-]", "", texto)
    return re.sub(r"[-\s]+", "_", texto).strip("-_")


def carregar_configuracao(caminho: Path = CONFIG_FILE) -> Dict[str, Any]:
    """Lê e valida o arquivo de configuração config.json."""
    if not caminho.exists():
        raise FileNotFoundError(f"Arquivo de configuração não encontrado em: {caminho}")

    with open(caminho, "r", encoding="utf-8") as f:
        config = json.load(f)

    if "produtos" not in config or not isinstance(config["produtos"], list):
        raise ValueError("O formato do config.json deve conter a chave 'produtos' com uma lista.")

    return config


def salvar_configuracao(dados: Dict[str, Any], caminho: Path = CONFIG_FILE) -> None:
    """Persiste alterações no arquivo config.json (ex: desativação por expiração)."""
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)
    logger.info(f"Arquivo de configuração atualizado: {caminho}")


def verificar_expiracao(produto: Dict[str, Any], hoje: date) -> bool:
    """
    Verifica se a data atual ultrapassou a data limite estipulada para o produto.
    Formato esperado da data: 'AAAA-MM-DD'.
    """
    data_limite_str = produto.get("data_limite")
    if not data_limite_str:
        return False

    try:
        data_limite = datetime.strptime(data_limite_str, "%Y-%m-%d").date()
        return hoje > data_limite
    except ValueError:
        logger.error(
            f"Formato inválido de data_limite '{data_limite_str}' para o produto '{produto.get('nome_produto')}'. "
            "Use o formato AAAA-MM-DD."
        )
        return False


def ler_historico_produto(
    nome_produto: str, csv_path: Path = HISTORICO_CSV
) -> List[Dict[str, Any]]:
    """Lê o arquivo CSV e retorna os registros ordenados por data para o produto informado."""
    if not csv_path.exists():
        return []

    registros = []
    try:
        with open(csv_path, mode="r", encoding="utf-8", newline="") as f:
            leitor = csv.DictReader(f)
            for linha in leitor:
                if linha.get("nome_produto") == nome_produto:
                    try:
                        data_dt = datetime.strptime(linha["data_hora"], "%Y-%m-%d %H:%M:%S")
                        preco_val = float(linha["preco"])
                        registros.append(
                            {
                                "data_hora": data_dt,
                                "preco": preco_val,
                                "link": linha.get("link_produto", ""),
                                "plataforma": linha.get("plataforma", ""),
                            }
                        )
                    except (ValueError, KeyError):
                        continue
    except Exception as e:
        logger.warning(f"Erro ao ler histórico de '{nome_produto}': {e}")
        return []

    # Ordena cronologicamente
    registros.sort(key=lambda x: x["data_hora"])
    return registros


def obter_ultima_verificacao(nome_produto: str, csv_path: Path = HISTORICO_CSV) -> Optional[datetime]:
    """Retorna o timestamp da última coleta registrada no CSV para um determinado produto."""
    registros = ler_historico_produto(nome_produto, csv_path)
    if not registros:
        return None
    return registros[-1]["data_hora"]


def deve_executar(
    produto: Dict[str, Any],
    agora: datetime,
    force: bool = False,
    csv_path: Path = HISTORICO_CSV,
) -> bool:
    """
    Avalia se o produto deve ser monitorado nesta execução, respeitando:
    - O flag booleano 'ativo'.
    - O intervalo estipulado em 'frequencia_horas'.
    """
    if not produto.get("ativo", False):
        logger.info(f"[-] '{produto['nome_produto']}' está marcado como INATIVO. Pulando...")
        return False

    if force:
        return True

    frequencia_horas = produto.get("frequencia_horas", 4)
    ultima_exec = obter_ultima_verificacao(produto["nome_produto"], csv_path=csv_path)

    if ultima_exec:
        delta = agora - ultima_exec
        horas_decorridas = delta.total_seconds() / 3600.0
        if horas_decorridas < frequencia_horas:
            logger.info(
                f"[PAUSA] '{produto['nome_produto']}' verificado há {horas_decorridas:.1f}h. "
                f"Frequência definida: a cada {frequencia_horas}h. Aguardando próximo ciclo."
            )
            return False

    return True


def salvar_registro_csv(
    item: ScrapedItem, nome_produto: str, agora: datetime, csv_path: Path = HISTORICO_CSV
) -> None:
    """Acrescenta o registro coletado ao histórico acumulado (historico_precos.csv)."""
    arquivo_novo = not csv_path.exists()
    colunas = ["data_hora", "nome_produto", "preco", "link_produto", "plataforma"]

    with open(csv_path, mode="a", encoding="utf-8", newline="") as f:
        escritor = csv.writer(f)
        if arquivo_novo:
            escritor.writerow(colunas)
            logger.info(f"Histórico inicial criado em: {csv_path}")

        escritor.writerow(
            [
                agora.strftime("%Y-%m-%d %H:%M:%S"),
                nome_produto,
                f"{item.preco:.2f}",
                item.link,
                item.plataforma,
            ]
        )
        logger.info(f"Preço de R$ {item.preco:.2f} registrado no histórico CSV.")


def gerar_grafico_historico(
    nome_produto: str, csv_path: Path = HISTORICO_CSV, output_dir: Path = GRAFICOS_DIR
) -> Optional[Path]:
    """
    Gera um gráfico moderno de linha com a evolução do menor preço registrado ao longo do tempo.
    Destaque visual para o menor preço histórico e layout dark mode elegante.
    """
    registros = ler_historico_produto(nome_produto, csv_path)
    if not registros:
        return None

    try:
        output_dir.mkdir(parents=True, exist_ok=True)
        nome_slug = slugify(nome_produto)
        caminho_grafico = output_dir / f"grafico_{nome_slug}.png"

        # Configuração visual do gráfico
        plt.style.use("dark_background")
        fig, ax = plt.subplots(figsize=(10, 5), dpi=150)

        # Paleta de cores moderna
        cor_fundo = "#0f172a"      # Slate escuro
        cor_card = "#1e293b"       # Cartão do gráfico
        cor_linha = "#00f2fe"      # Ciano brilhante
        cor_ponto = "#38bdf8"      # Azul claro
        cor_minimo = "#22c55e"     # Verde neon para o recorde de menor preço

        fig.patch.set_facecolor(cor_fundo)
        ax.set_facecolor(cor_card)

        datas = [r["data_hora"] for r in registros]
        precos = [r["preco"] for r in registros]

        # Plota linha e marcadores
        ax.plot(
            datas,
            precos,
            color=cor_linha,
            linewidth=2.5,
            marker="o",
            markersize=6,
            markerfacecolor=cor_ponto,
            markeredgecolor="#ffffff",
            label="Menor Preço Encontrado",
        )

        # Destaca o menor preço histórico de todos os tempos
        menor_preco = min(precos)
        indice_menor = precos.index(menor_preco)
        data_menor = datas[indice_menor]

        ax.plot(
            data_menor,
            menor_preco,
            marker="*",
            markersize=15,
            color=cor_minimo,
            label=f"Menor Preço Histórico (R$ {menor_preco:.2f})",
        )

        ax.annotate(
            f" R$ {menor_preco:.2f}",
            xy=(data_menor, menor_preco),
            xytext=(0, 15),
            textcoords="offset points",
            color=cor_minimo,
            fontweight="bold",
            fontsize=10,
            ha="center",
            bbox=dict(boxstyle="round,pad=0.3", fc="#14532d", ec=cor_minimo, lw=1.2),
        )

        # Formatação dos eixos
        ax.set_title(
            f"Histórico de Preços: {nome_produto}",
            fontsize=13,
            fontweight="bold",
            color="#f8fafc",
            pad=15,
        )
        ax.set_ylabel("Preço (R$)", fontsize=11, color="#cbd5e1", labelpad=10)
        ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda val, pos: f"R$ {val:,.2f}"))

        # Formatação do eixo X de datas
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m %H:%M"))
        fig.autofmt_xdate(rotation=30)

        # Grade sutil
        ax.grid(True, linestyle="--", alpha=0.25, color="#94a3b8")
        ax.legend(loc="upper right", framealpha=0.4, facecolor="#0f172a", edgecolor="#475569")

        plt.tight_layout()
        fig.savefig(caminho_grafico, bbox_inches="tight", facecolor=fig.get_facecolor())

        # Também atualiza o grafico_precos.png geral na raiz para compatibilidade
        fig.savefig(GRAFICO_PADRAO, bbox_inches="tight", facecolor=fig.get_facecolor())
        plt.close(fig)

        logger.info(f"Gráfico atualizado gerado em: {caminho_grafico}")
        return caminho_grafico
    except Exception as e:
        logger.error(f"Erro ao gerar gráfico para '{nome_produto}': {e}", exc_info=True)
        return None


def analisar_historico_preco(
    nome_produto: str, preco_atual: float, csv_path: Path = HISTORICO_CSV
) -> Tuple[bool, Optional[str]]:
    """
    Compara o preço atual com o histórico anterior:
    Retorna: (eh_menor_historico, texto_variacao)
    """
    registros = ler_historico_produto(nome_produto, csv_path)
    if not registros:
        return True, "Primeiro registro monitorado!"

    precos_anteriores = [r["preco"] for r in registros]
    menor_anterior = min(precos_anteriores)
    ultimo_anterior = precos_anteriores[-1]

    eh_menor = preco_atual <= menor_anterior

    diff = preco_atual - ultimo_anterior
    if diff < 0:
        pct = abs(diff) / ultimo_anterior * 100
        texto = f"📉 <b>Queda de R$ {abs(diff):.2f}</b> (-{pct:.1f}% vs última checagem)"
    elif diff > 0:
        pct = diff / ultimo_anterior * 100
        texto = f"📈 <b>Subiu R$ {diff:.2f}</b> (+{pct:.1f}% vs última checagem)"
    else:
        texto = "➡️ Preço estável em relação à última checagem"

    if eh_menor:
        texto += "\n🔥 <b>RECORDE: Menor preço histórico já registrado!</b>"

    return eh_menor, texto



def enviar_alerta_telegram(
    nome_produto: str,
    item: ScrapedItem,
    caminho_grafico: Optional[Path],
    texto_variacao: Optional[str] = None,
) -> bool:
    """Envia mensagem formatada com gráfico em anexo para o Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning(
            "[Telegram] TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados. "
            "Notificação em tela apenas."
        )
        return False

    emoji_plataforma = "🟡" if "Mercado" in item.plataforma else "🟠"

    mensagem = (
        f"🚨 <b>ALERTA DE PREÇO ENCONTRADO!</b>\n\n"
        f"📦 <b>Produto:</b> {nome_produto}\n"
        f"🏷️ <b>Item:</b> {item.titulo}\n"
        f"{emoji_plataforma} <b>Plataforma:</b> {item.plataforma}\n"
        f"💰 <b>Menor Preço:</b> <code>R$ {item.preco:.2f}</code>\n"
    )

    if texto_variacao:
        mensagem += f"\n📊 {texto_variacao}\n"

    mensagem += (
        f"\n🛒 <a href='{item.link}'>👉 Clique aqui para acessar a melhor oferta</a>\n\n"
        f"⏱️ <i>Verificado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</i>"
    )

    # Envia foto com caption se o gráfico existir
    if caminho_grafico and caminho_grafico.exists():
        url_api = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto"
        try:
            with open(caminho_grafico, "rb") as foto:
                payload = {
                    "chat_id": TELEGRAM_CHAT_ID,
                    "caption": mensagem,
                    "parse_mode": "HTML",
                }
                files = {"photo": foto}
                resp = requests.post(url_api, data=payload, files=files, timeout=25)
                if resp.status_code == 200:
                    logger.info("[Telegram] Alerta com foto enviado com sucesso!")
                    return True
                else:
                    logger.error(f"[Telegram] Falha ao enviar foto: {resp.text}")
        except Exception as e:
            logger.error(f"[Telegram] Erro ao enviar foto: {e}")

    # Fallback para envio apenas em texto
    url_msg = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        resp = requests.post(
            url_msg,
            json={
                "chat_id": TELEGRAM_CHAT_ID,
                "text": mensagem,
                "parse_mode": "HTML",
                "disable_web_page_preview": False,
            },
            timeout=20,
        )
        if resp.status_code == 200:
            logger.info("[Telegram] Mensagem de texto enviada com sucesso!")
            return True
        else:
            logger.error(f"[Telegram] Falha ao enviar mensagem: {resp.text}")
            return False
    except Exception as e:
        logger.error(f"[Telegram] Erro de conexão com o Telegram: {e}")
        return False


def enviar_aviso_expiracao(nome_produto: str, data_limite: str) -> None:
    """Envia notificação específica avisando que o monitoramento expirou."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return

    mensagem = (
        f"⏳ <b>MONITORAMENTO ENCERRADO (EXPIRADO)</b>\n\n"
        f"📦 <b>Produto:</b> {nome_produto}\n"
        f"📅 <b>Data Limite Atingida:</b> {data_limite}\n\n"
        f"<i>O período de busca para este produto terminou. O item foi desativado automaticamente "
        f"do monitoramento. Para reativar, estenda o campo 'data_limite' no config.json.</i>"
    )

    url_msg = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        requests.post(
            url_msg,
            json={
                "chat_id": TELEGRAM_CHAT_ID,
                "text": mensagem,
                "parse_mode": "HTML",
            },
            timeout=20,
        )
        logger.info(f"[Telegram] Notificação de expiração enviada para '{nome_produto}'.")
    except Exception as e:
        logger.error(f"[Telegram] Erro ao notificar expiração: {e}")


def obter_scraper(url: str):
    """Identifica a plataforma com base no domínio da URL e instancia o scraper adequado."""
    url_lower = url.lower()
    if "mercadolivre.com" in url_lower or "mercadolibre.com" in url_lower:
        return MercadoLivreScraper()
    elif "shopee.com" in url_lower:
        return ShopeeScraper()
    else:
        logger.error(f"Plataforma não suportada para a URL: {url}")
        return None


def executar_monitoramento(force: bool = False) -> None:
    """Executa a rotina completa de monitoramento para todos os produtos configurados."""
    logger.info("=" * 60)
    logger.info("Iniciando ciclo de monitoramento de preços...")
    logger.info("=" * 60)

    try:
        config = carregar_configuracao()
    except Exception as e:
        logger.critical(f"Falha fatal ao carregar config.json: {e}")
        return

    produtos = config.get("produtos", [])
    agora = datetime.now()
    hoje = agora.date()
    config_modificado = False

    for produto in produtos:
        nome_produto = produto.get("nome_produto", "Produto Sem Nome")
        url_pesquisa = produto.get("url_pesquisa", "")
        data_limite = produto.get("data_limite", "")

        logger.info(f"\n--- Verificando: {nome_produto} ---")

        # 1. Checagem de expiração da data limite
        if verificar_expiracao(produto, hoje):
            logger.warning(
                f"[EXPIRADO] O monitoramento de '{nome_produto}' expirou em {data_limite}."
            )
            enviar_aviso_expiracao(nome_produto, data_limite)
            produto["ativo"] = False
            config_modificado = True
            continue

        # 2. Checagem de status ativo e frequência
        if not deve_executar(produto, agora, force=force):
            continue

        # 3. Inicialização do scraper conforme o marketplace
        scraper = obter_scraper(url_pesquisa)
        if not scraper:
            continue

        # 4. Extração do menor preço válido
        item_menor_preco = scraper.extrair_menor_preco(url_pesquisa)
        if not item_menor_preco:
            logger.warning(f"Não foi possível obter preço para '{nome_produto}'.")
            continue

        logger.info(
            f"Resultado: [{item_menor_preco.plataforma}] R$ {item_menor_preco.preco:.2f} "
            f"| Link: {item_menor_preco.link}"
        )

        # 5. Analisa tendência e recorde com base no histórico prévio
        _, texto_variacao = analisar_historico_preco(nome_produto, item_menor_preco.preco)

        # 6. Salva no histórico acumulado CSV
        salvar_registro_csv(item_menor_preco, nome_produto, agora)

        # 7. Gera gráfico atualizado (já incluindo a medição atual)
        caminho_grafico = gerar_grafico_historico(nome_produto)

        # 8. Notifica no Telegram
        enviar_alerta_telegram(
            nome_produto=nome_produto,
            item=item_menor_preco,
            caminho_grafico=caminho_grafico,
            texto_variacao=texto_variacao,
        )

    # Se produtos expiraram e foram desativados, salva o config.json atualizado
    if config_modificado:
        salvar_configuracao(config)

    logger.info("\n" + "=" * 60)
    logger.info("Ciclo de monitoramento finalizado com sucesso!")
    logger.info("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Bot de Monitoramento de Preços no Mercado Livre e Shopee."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Ignora a regra de frequência_horas e força a verificação de todos os itens ativos.",
    )
    args = parser.parse_args()

    executar_monitoramento(force=args.force)
