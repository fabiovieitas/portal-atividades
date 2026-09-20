"""
Scraper especializado para busca de produtos na Shopee.
Utiliza extração direta de HTML SSR (social crawler bypass) e contingência com Playwright.
Filtra estritamente produtos de vendedores nacionais.
"""

import logging
import os
import re
from typing import Optional
from urllib.parse import parse_qs, quote, urlparse

import requests
from bs4 import BeautifulSoup

from .base import BaseScraper, ScrapedItem, parse_cookie_string, cookies_to_dict

logger = logging.getLogger(__name__)


class ShopeeScraper(BaseScraper):
    PLATAFORMA = "Shopee"

    HEADERS_SSR = {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    }

    HEADERS_STANDARD = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    }

    def _parse_preco_string(self, texto: str) -> Optional[float]:
        padrao = r"R\$\s*([\d\.]+)(?:,(\d{2}))?"
        matches = re.findall(padrao, texto)
        if not matches:
            padrao_alt = r"([\d\.]+),(\d{2})"
            matches = re.findall(padrao_alt, texto)

        valores = []
        for inteiro, centavos in matches:
            try:
                valor_limpo = inteiro.replace(".", "")
                centavos_val = centavos if centavos else "00"
                num = float(f"{valor_limpo}.{centavos_val}")
                if num > 0:
                    valores.append(num)
            except ValueError:
                continue

        return min(valores) if valores else None

    def _eh_internacional(self, texto: str) -> bool:
        texto_lower = texto.lower()
        return any(termo in texto_lower for termo in ["internacional", "exterior", "china", "do exterior"])

    def _extrair_via_ssr(self, url: str) -> Optional[ScrapedItem]:
        """Extração direta do HTML SSR com bypass de verificação e filtro nacional."""
        try:
            logger.info(f"[Shopee - SSR] Consultando com perfil social: {url}")
            cookie_str = os.getenv("SHOPEE_COOKIES", "").strip()
            cookies = cookies_to_dict(cookie_str) if cookie_str else None

            resp = requests.get(url, headers=self.HEADERS_SSR, cookies=cookies, timeout=15)
            if resp.status_code != 200 or "verify/traffic/error" in resp.url:
                return None

            soup = BeautifulSoup(resp.text, "html.parser")
            itens = []

            for a in soup.find_all("a", href=True):
                href = a["href"]
                if "-i." in href or "/product/" in href:
                    card_text = a.get_text(separator=" ", strip=True)
                    if self._eh_internacional(card_text):
                        continue

                    m = re.search(r"R\$\s*([\d\.]+),(\d{2})", card_text)
                    if m:
                        try:
                            preco = float(m.group(1).replace(".", "") + "." + m.group(2))
                            titulo = card_text.split("R$")[0].strip()
                            if titulo and preco > 1:
                                link_completo = href if href.startswith("http") else f"https://shopee.com.br{href.split('?')[0]}"
                                itens.append(
                                    ScrapedItem(
                                        titulo=titulo[:120],
                                        preco=preco,
                                        link=link_completo,
                                        plataforma="Shopee",
                                    )
                                )
                        except Exception:
                            continue

            if itens:
                menor = min(itens, key=lambda x: x.preco)
                logger.info(f"[Shopee - SSR Nacional] Menor preço encontrado: R$ {menor.preco:.2f} - '{menor.titulo[:40]}...'")
                return menor

        except Exception as e:
            logger.debug(f"[Shopee - SSR] Erro: {e}")

        return None

    def extrair_menor_preco(self, url: str) -> Optional[ScrapedItem]:
        logger.info(f"[Shopee] Buscando menor preço nacional para URL: {url}")
        resultado = self._extrair_via_ssr(url)
        if resultado:
            logger.info(f"[Shopee] Menor preço nacional encontrado: R$ {resultado.preco:.2f}")
        else:
            logger.warning("[Shopee] Não foi possível obter preço nacional.")
        return resultado
