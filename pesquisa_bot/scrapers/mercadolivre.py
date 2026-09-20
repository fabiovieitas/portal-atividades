"""
Scraper especializado para busca de produtos no Mercado Livre.
Suporta layout clássico e cards polimórficos (.poly-card).
Filtra estritamente produtos NACIONAIS (eliminando anúncios importados/China)
e utiliza headers resilientes contra bloqueios anti-bot.
"""

import logging
import os
import re
from typing import Optional
from urllib.parse import urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

from .base import BaseScraper, ScrapedItem, parse_cookie_string, cookies_to_dict

logger = logging.getLogger(__name__)


class MercadoLivreScraper(BaseScraper):
    PLATAFORMA = "Mercado Livre"

    # Headers resilientes que não sofrem bloqueio de IP ou desafio de tráfego
    HEADERS_CRAWLERS = [
        {
            "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        {
            "User-Agent": "WhatsApp/2.21.12.21 A",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        {
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        },
    ]

    HEADERS_STANDARD = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    }

    def _limpar_url_produto(self, url: str) -> str:
        """Remove parâmetros de tracking e âncoras da URL."""
        try:
            parsed = urlparse(url)
            return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
        except Exception:
            return url.split("#")[0]

    def _extrair_preco_container(self, container) -> Optional[float]:
        """Extrai o valor numérico em reais considerando fração e centavos."""
        preco_box = (
            container.select_one(".poly-price__current")
            or container.select_one(".ui-search-price__second-line")
            or container.select_one(".andes-money-amount:not(.andes-money-amount--previous)")
        )
        alvo = preco_box if preco_box else container

        if alvo.select_one(".andes-money-amount--previous") and not preco_box:
            candidatos = alvo.select(".andes-money-amount:not(.andes-money-amount--previous)")
            if candidatos:
                alvo = candidatos[-1]

        fracao_elem = alvo.select_one(".andes-money-amount__fraction")
        if not fracao_elem:
            match = re.search(r"R\$\s*([\d\.]+)(?:,(\d{2}))?", alvo.get_text())
            if match:
                inteiro = match.group(1).replace(".", "")
                centavos = match.group(2) or "00"
                try:
                    return float(f"{inteiro}.{centavos}")
                except ValueError:
                    pass
            return None

        texto_fracao = fracao_elem.get_text(strip=True).replace(".", "").replace(",", "")
        centavos_elem = alvo.select_one(".andes-money-amount__cents")
        texto_centavos = centavos_elem.get_text(strip=True) if centavos_elem else "00"

        try:
            return float(f"{texto_fracao}.{texto_centavos}")
        except ValueError:
            return None

    def _eh_internacional(self, card) -> bool:
        """Verifica se o card pertence a uma compra internacional ou importada."""
        texto_card = card.get_text(" ", strip=True).lower()
        termos_internacionais = [
            "internacional",
            "china",
            "exterior",
            "importad",
            "do exterior",
            "compra internacional",
            "envio internacional",
        ]
        return any(termo in texto_card for termo in termos_internacionais)

    def _parsear_soup(self, soup: BeautifulSoup, filtro_nacional: bool = True) -> Optional[ScrapedItem]:
        """Extrai os cards e seleciona o menor preço nacional."""
        cards = soup.select(
            ".poly-card, "
            ".poly-card__content, "
            "li.ui-search-layout__item, "
            "div.ui-search-result__wrapper, "
            "div.ui-search-result"
        )

        if not cards:
            return None

        itens_encontrados = []
        for card in cards:
            # 1. Filtra anúncios internacionais se busca nacional
            if filtro_nacional and self._eh_internacional(card):
                continue

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

    def _extrair_via_requests(self, url: str) -> Optional[ScrapedItem]:
        """Executa requisições com fallbacks de crawlers resilientes."""
        cookie_str = os.getenv("MERCADOLIVRE_COOKIES", "").strip()
        cookies = cookies_to_dict(cookie_str) if cookie_str else None

        # Garante que a URL contenha o filtro de Envio Nacional caso ainda não possua
        url_busca = url
        if "SHIPPING*ORIGIN" not in url_busca and "SHIPPING_ORIGIN" not in url_busca:
            if "?" in url_busca:
                url_busca = url_busca.replace("?", "_SHIPPING*ORIGIN_10215068?")
            else:
                url_busca += "_SHIPPING*ORIGIN_10215068"

        # Tenta a lista de perfis resilientes
        headers_lista = self.HEADERS_CRAWLERS + [self.HEADERS_STANDARD]
        for headers in headers_lista:
            try:
                resp = requests.get(url_busca, headers=headers, cookies=cookies, timeout=12)
                if resp.status_code == 200 and "account-verification" not in resp.url:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    resultado = self._parsear_soup(soup, filtro_nacional=True)
                    if resultado:
                        return resultado
            except Exception as e:
                logger.debug(f"[Mercado Livre] Tentativa falhou com {headers.get('User-Agent')[:20]}: {e}")

        return None

    def extrair_menor_preco(self, url: str) -> Optional[ScrapedItem]:
        logger.info(f"[Mercado Livre] Buscando menor preço nacional para URL: {url}")
        resultado = self._extrair_via_requests(url)

        if resultado:
            logger.info(
                f"[Mercado Livre - Nacional] Menor preço encontrado: R$ {resultado.preco:.2f} - '{resultado.titulo[:40]}...'"
            )
        else:
            logger.warning("[Mercado Livre] Não foi possível encontrar produtos nacionais válidos nesta página.")

        return resultado
