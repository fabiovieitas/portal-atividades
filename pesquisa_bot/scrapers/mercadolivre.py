"""
Scraper especializado para Mercado Livre.
Suporta layout clássico (ui-search-layout) e novos layouts com cards polimórficos (poly-card).
"""

import logging
import re
from typing import Optional
from urllib.parse import urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

from .base import BaseScraper, ScrapedItem

logger = logging.getLogger(__name__)


class MercadoLivreScraper(BaseScraper):
    """Extrai o menor preço de páginas de busca do Mercado Livre."""

    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept": (
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,"
            "image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        ),
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
    }

    def _limpar_url_produto(self, url: str) -> str:
        """Remove parâmetros desnecessários de tracking do link do produto."""
        try:
            parsed = urlparse(url)
            # Remove âncoras como #position=1&searchVariation=...
            return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
        except Exception:
            return url

    def _extrair_preco_container(self, container) -> Optional[float]:
        """
        Extrai o valor numérico em reais considerando fração e centavos,
        descartando preços originais/riscados.
        """
        # Tenta localizar container de preço atual (novo layout poly-card ou clássico)
        preco_box = (
            container.select_one(".poly-price__current")
            or container.select_one(".ui-search-price__second-line")
            or container.select_one(".andes-money-amount:not(.andes-money-amount--previous)")
        )

        alvo = preco_box if preco_box else container

        # Não queremos o preço riscado (preço anterior)
        if alvo.select_one(".andes-money-amount--previous") and not preco_box:
            alvo_candidatos = alvo.select(".andes-money-amount:not(.andes-money-amount--previous)")
            if alvo_candidatos:
                alvo = alvo_candidatos[-1]

        fracao_elem = alvo.select_one(".andes-money-amount__fraction")
        if not fracao_elem:
            return None

        texto_fracao = fracao_elem.get_text(strip=True).replace(".", "").replace(",", "")
        centavos_elem = alvo.select_one(".andes-money-amount__cents")
        texto_centavos = centavos_elem.get_text(strip=True) if centavos_elem else "00"

        try:
            return float(f"{texto_fracao}.{texto_centavos}")
        except ValueError:
            return None

    def _extrair_via_requests(self, url: str) -> Optional[ScrapedItem]:
        """Tenta extração rápida via requisição HTTP com headers de navegador e cookies."""
        cookie_str = os.getenv("MERCADOLIVRE_COOKIES", "").strip()
        cookies = cookies_to_dict(cookie_str) if cookie_str else None

        try:
            response = requests.get(url, headers=self.HEADERS, cookies=cookies, timeout=20)
            if "account-verification" in response.url:
                logger.warning(
                    "[Mercado Livre] Desafio de tráfego detectado (account-verification). "
                    "Recomenda-se configurar a variável MERCADOLIVRE_COOKIES caso necessário."
                )
                return None
            response.raise_for_status()
        except Exception as e:
            logger.debug(f"[Mercado Livre - Requests] Erro: {e}")
            return None

        soup = BeautifulSoup(response.text, "html.parser")
        return self._parsear_soup(soup)

    def _parsear_soup(self, soup: BeautifulSoup) -> Optional[ScrapedItem]:
        """Extrai os cards e localiza o menor preço no documento HTML parseado."""
        cards = soup.select(
            ".poly-card, "
            ".poly-card__content, "
            "li.ui-search-layout__item, "
            "div.ui-search-result__wrapper"
        )

        if not cards:
            return None

        itens_encontrados = []
        for card in cards:
            titulo_elem = (
                card.select_one(".poly-component__title")
                or card.select_one(".ui-search-item__title")
                or card.select_one("h2")
                or card.select_one("h3")
            )
            if not titulo_elem:
                continue
            titulo = titulo_elem.get_text(strip=True)

            link_elem = (
                card.select_one("a.poly-component__title")
                or card.select_one("a.ui-search-link")
                or card.select_one("a[href*='/MLB-']")
                or card.select_one("a[href*='mercadolivre.com.br']")
            )
            if not link_elem or not link_elem.get("href"):
                if titulo_elem.name == "a" and titulo_elem.get("href"):
                    link_elem = titulo_elem
                else:
                    parent_link = card.find_parent("a")
                    if parent_link and parent_link.get("href"):
                        link_elem = parent_link
                    else:
                        continue

            link_bruto = link_elem["href"]
            link_limpo = self._limpar_url_produto(link_bruto)

            preco = self._extrair_preco_container(card)
            if preco is None or preco <= 0:
                continue

            itens_encontrados.append(
                ScrapedItem(
                    titulo=titulo,
                    preco=preco,
                    link=link_limpo,
                    plataforma="Mercado Livre",
                )
            )

        if not itens_encontrados:
            return None

        menor_item = min(itens_encontrados, key=lambda item: item.preco)
        return menor_item

    def _extrair_via_playwright(self, url: str) -> Optional[ScrapedItem]:
        """Contingência com navegador headless via Playwright."""
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            return None

        cookie_str = os.getenv("MERCADOLIVRE_COOKIES", "").strip()

        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=["--disable-blink-features=AutomationControlled", "--no-sandbox"],
                )
                context = browser.new_context(
                    user_agent=self.HEADERS["User-Agent"],
                    locale="pt-BR",
                )
                if cookie_str:
                    pw_cookies = parse_cookie_string(cookie_str, ".mercadolivre.com.br")
                    if pw_cookies:
                        context.add_cookies(pw_cookies)

                page = context.new_page()
                page.goto(url, wait_until="domcontentloaded", timeout=25000)
                page.wait_for_timeout(2000)

                html = page.content()
                browser.close()

                soup = BeautifulSoup(html, "html.parser")
                return self._parsear_soup(soup)
        except Exception as e:
            logger.debug(f"[Mercado Livre - Playwright] Erro: {e}")
            return None

    def extrair_menor_preco(self, url: str) -> Optional[ScrapedItem]:
        """
        Acessa a URL de busca do Mercado Livre e localiza o item com menor preço.
        Tenta via HTTP requests e recorre ao Playwright caso necessário.
        """
        logger.info(f"[Mercado Livre] Buscando URL: {url}")
        resultado = self._extrair_via_requests(url)
        if not resultado:
            logger.info("[Mercado Livre] Tentando extração via contingência de navegador...")
            resultado = self._extrair_via_playwright(url)

        if resultado:
            logger.info(
                f"[Mercado Livre] Menor preço encontrado: R$ {resultado.preco:.2f} - '{resultado.titulo[:40]}...'"
            )
        else:
            logger.warning("[Mercado Livre] Não foi possível encontrar produtos válidos nesta página.")

        return resultado

