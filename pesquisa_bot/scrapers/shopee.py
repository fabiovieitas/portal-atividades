"""
Scraper especializado para Shopee.
Utiliza Playwright Headless para renderizar a SPA dinamicamente e contornar proteções.
Possui fallback para a API interna de busca da Shopee.
"""

import logging
import re
from typing import Optional
from urllib.parse import parse_qs, quote, urlparse

from .base import BaseScraper, ScrapedItem

logger = logging.getLogger(__name__)


class ShopeeScraper(BaseScraper):
    """Extrai o menor preço de pesquisas na Shopee."""

    def _parse_preco_string(self, texto: str) -> Optional[float]:
        """
        Converte string de preço da Shopee (ex: 'R$ 45,90' ou 'R$ 29,90 - R$ 59,00')
        para o menor valor numérico float.
        """
        if not texto:
            return None

        # Procura por padrões numéricos monetários como 45,90 ou 1.250,00
        padroes = re.findall(r"(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})", texto)
        if not padroes:
            # Fallback para números inteiros
            padroes = re.findall(r"(?:R\$\s*)?(\d+)", texto)
            if not padroes:
                return None

        valores = []
        for p in padroes:
            try:
                limpo = p.replace(".", "").replace(",", ".")
                val = float(limpo)
                if val > 0:
                    valores.append(val)
            except ValueError:
                continue

        return min(valores) if valores else None

    def _extrair_via_playwright(self, url: str) -> Optional[ScrapedItem]:
        """Tenta extrair produtos renderizados no navegador headless via Playwright."""
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("[Shopee] Playwright não instalado. Tentando método alternativo via API.")
            return None

        logger.info(f"[Shopee - Playwright] Acessando URL: {url}")
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-blink-features=AutomationControlled",
                        "--disable-infobars",
                    ],
                )
                context = browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                    ),
                    viewport={"width": 1366, "height": 768},
                    locale="pt-BR",
                )
                page = context.new_page()

                # Acessa a URL com timeout de 30 segundos
                page.goto(url, wait_until="domcontentloaded", timeout=30000)

                # Espera pelos itens serem injetados no DOM
                try:
                    page.wait_for_selector(
                        'div[data-sqe="item"], div.shopee-search-item-result__item, a[data-sqe="link"]',
                        timeout=12000,
                    )
                except Exception:
                    logger.warning("[Shopee] Timeout aguardando seletor de itens. Rolando a página...")

                # Rola suavemente para baixo para disparar o carregamento dinâmico
                page.evaluate("window.scrollBy(0, 600)")
                page.wait_for_timeout(2000)

                # Localiza todos os cards de produtos
                cards = page.query_selector_all(
                    'div[data-sqe="item"], div.shopee-search-item-result__item, a[data-sqe="link"]'
                )

                itens_encontrados = []

                for card in cards:
                    try:
                        # Extrai link
                        link_handle = (
                            card if card.get_attribute("href") else card.query_selector('a[data-sqe="link"], a')
                        )
                        if not link_handle:
                            continue

                        href = link_handle.get_attribute("href")
                        if not href:
                            continue

                        link_completo = href if href.startswith("http") else f"https://shopee.com.br{href}"

                        # Extrai título
                        titulo_elem = card.query_selector('div[data-sqe="name"], .whitespace-normal, img')
                        titulo = ""
                        if titulo_elem:
                            titulo = (
                                titulo_elem.inner_text().strip()
                                or titulo_elem.get_attribute("alt")
                                or ""
                            )

                        if not titulo:
                            titulo = card.inner_text().split("\n")[0].strip()

                        # Extrai texto do card para parsear preço
                        card_text = card.inner_text()
                        preco = self._parse_preco_string(card_text)

                        if preco and preco > 0 and titulo:
                            itens_encontrados.append(
                                ScrapedItem(
                                    titulo=titulo[:120],
                                    preco=preco,
                                    link=link_completo.split("?")[0],
                                    plataforma="Shopee",
                                )
                            )
                    except Exception as err:
                        logger.debug(f"[Shopee] Erro ao processar card: {err}")
                        continue

                browser.close()

                if itens_encontrados:
                    menor_item = min(itens_encontrados, key=lambda x: x.preco)
                    logger.info(
                        f"[Shopee - Playwright] Menor preço encontrado: R$ {menor_item.preco:.2f} - '{menor_item.titulo[:40]}...'"
                    )
                    return menor_item

        except Exception as e:
            logger.error(f"[Shopee - Playwright] Erro durante navegação: {e}")

        return None

    def _extrair_via_api(self, url: str) -> Optional[ScrapedItem]:
        """
        Fallback: Se o Playwright falhar ou não estiver no ambiente,
        tenta consultar a API de busca pública da Shopee.
        """
        import requests

        logger.info(f"[Shopee - API] Tentando extração alternativa via API para: {url}")
        parsed = urlparse(url)
        params = parse_qs(parsed.query)

        keyword = params.get("keyword", [""])[0]
        if not keyword:
            # Tenta pegar da rota se for busca por categoria/palavra
            path_parts = parsed.path.strip("/").split("/")
            if path_parts:
                keyword = path_parts[-1].replace("-", " ")

        if not keyword:
            logger.warning("[Shopee - API] Não foi possível extrair a palavra-chave da URL.")
            return None

        api_url = (
            f"https://shopee.com.br/api/v4/search/search_items?"
            f"by=price&order=asc&keyword={quote(keyword)}&limit=20&newest=0"
        )

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json",
            "Referer": url,
            "x-requested-with": "XMLHttpRequest",
        }

        try:
            resp = requests.get(api_url, headers=headers, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("items") or []
                itens_encontrados = []
                for entry in items:
                    basic = entry.get("item_basic", {})
                    nome = basic.get("name")
                    preco_bruto = basic.get("price")  # Preço vem multiplicado por 100000
                    item_id = basic.get("itemid")
                    shop_id = basic.get("shopid")

                    if nome and preco_bruto and item_id and shop_id:
                        preco = preco_bruto / 100000.0
                        link = f"https://shopee.com.br/product/{shop_id}/{item_id}"
                        itens_encontrados.append(
                            ScrapedItem(
                                titulo=nome,
                                preco=preco,
                                link=link,
                                plataforma="Shopee",
                            )
                        )

                if itens_encontrados:
                    menor_item = min(itens_encontrados, key=lambda x: x.preco)
                    logger.info(
                        f"[Shopee - API] Menor preço encontrado via API: R$ {menor_item.preco:.2f}"
                    )
                    return menor_item
        except Exception as e:
            logger.warning(f"[Shopee - API] Erro ao consultar API: {e}")

        return None

    def extrair_menor_preco(self, url: str) -> Optional[ScrapedItem]:
        """
        Tenta extração primária com Playwright (para garantir respeito a todos os filtros da URL)
        e recorre à API da Shopee se necessário.
        """
        resultado = self._extrair_via_playwright(url)
        if not resultado:
            resultado = self._extrair_via_api(url)
        return resultado
