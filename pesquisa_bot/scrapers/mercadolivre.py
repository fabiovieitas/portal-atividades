"""
Scraper especializado para Mercado Livre.
Suporta simultaneamente:
1. URLs de Pesquisa Filtrada (extrai o menor preço nacional entre todos os vendedores).
2. URLs Diretas de Produtos específicos (anúncios, catálogo /p/, /up/, /MLB-).
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

    def _limpar_url_produto(self, url: str) -> str:
        try:
            parsed = urlparse(url)
            return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
        except Exception:
            return url.split("#")[0].split("?")[0]

    def _eh_link_direto_produto(self, url: str) -> bool:
        """Identifica se a URL é de um produto individual em vez de uma lista de busca."""
        u = url.lower()
        if "produto.mercadolivre.com.br" in u:
            return True
        if "/p/mlb" in u or "/up/mlbu" in u:
            return True
        if "/mlb-" in u and "lista.mercadolivre.com.br" not in u:
            return True
        return False

    def _extrair_produto_direto(self, url: str) -> Optional[ScrapedItem]:
        """Extrai título e preço diretamente da página de um anúncio específico."""
        for headers in self.HEADERS_CRAWLERS:
            try:
                resp = requests.get(url, headers=headers, timeout=12)
                if resp.status_code == 200 and "account-verification" not in resp.url:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    h1 = soup.select_one("h1.ui-pdp-title, h1")
                    titulo = h1.get_text(strip=True) if h1 else "Produto Mercado Livre"
                    indisponivel = False
                    resp_lower = resp.text.lower()
                    if "indisponível" in resp_lower or "escolha outra variação" in resp_lower or "anúncio pausado" in resp_lower:
                        indisponivel = True

                    preco_frac = soup.select_one(
                        ".ui-pdp-price__second-line .andes-money-amount__fraction, .andes-money-amount__fraction"
                    )
                    preco_cents = soup.select_one(
                        ".ui-pdp-price__second-line .andes-money-amount__cents, .andes-money-amount__cents"
                    )
                    if preco_frac:
                        inteiro = preco_frac.get_text(strip=True).replace(".", "").replace(",", "")
                        centavos = preco_cents.get_text(strip=True) if preco_cents else "00"
                        preco = float(f"{inteiro}.{centavos}")
                        return ScrapedItem(
                            titulo=titulo,
                            preco=preco,
                            link=self._limpar_url_produto(url),
                            plataforma="Mercado Livre",
                        )
            except Exception as e:
                logger.debug(f"[Mercado Livre - Produto Direto] Falha: {e}")
        return None

    def _extrair_preco_container(self, container) -> Optional[float]:
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

    def _parsear_busca_soup(self, soup: BeautifulSoup) -> Optional[ScrapedItem]:
        cards = soup.select(
            ".poly-card, "
            ".poly-card__content, "
            "li.ui-search-layout__item, "
            "div.ui-search-result__wrapper, "
            "div.ui-search-result"
        )
        if not cards:
            return None

        itens = []
        for card in cards:
            if self._eh_internacional(card):
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
                continue

            link_limpo = self._limpar_url_produto(link_elem["href"])
            preco = self._extrair_preco_container(card)
            if preco and preco > 0:
                itens.append(
                    ScrapedItem(
                        titulo=titulo,
                        preco=preco,
                        link=link_limpo,
                        plataforma="Mercado Livre",
                    )
                )

        if not itens:
            return None

        return min(itens, key=lambda item: item.preco)

    def _extrair_busca(self, url: str) -> Optional[ScrapedItem]:
        url_busca = url
        if "SHIPPING*ORIGIN" not in url_busca and "SHIPPING_ORIGIN" not in url_busca:
            if "?" in url_busca:
                url_busca = url_busca.replace("?", "_SHIPPING*ORIGIN_10215068?")
            else:
                url_busca += "_SHIPPING*ORIGIN_10215068"

        for headers in self.HEADERS_CRAWLERS:
            try:
                resp = requests.get(url_busca, headers=headers, timeout=12)
                if resp.status_code == 200 and "account-verification" not in resp.url:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    resultado = self._parsear_busca_soup(soup)
                    if resultado:
                        return resultado
            except Exception as e:
                logger.debug(f"[Mercado Livre - Busca] Erro: {e}")

        return None

    def extrair_menor_preco(self, url: str) -> Optional[ScrapedItem]:
        logger.info(f"[Mercado Livre] Monitorando: {url}")
        if self._eh_link_direto_produto(url):
            logger.info("[Mercado Livre] Detectado link direto de produto. Extraindo anúncio específico...")
            resultado = self._extrair_produto_direto(url)
        else:
            logger.info("[Mercado Livre] Detectada URL de busca filtrada. Buscando menor preço nacional...")
            resultado = self._extrair_busca(url)

        if resultado:
            logger.info(
                f"[Mercado Livre] Preço obtido: R$ {resultado.preco:.2f} - '{resultado.titulo[:40]}...'"
            )
        else:
            logger.warning("[Mercado Livre] Não foi possível obter o preço deste anúncio/pesquisa.")

        return resultado
