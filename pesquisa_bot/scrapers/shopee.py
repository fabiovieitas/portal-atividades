"""
Scraper especializado para busca de produtos na Shopee.
Utiliza extração direta de HTML SSR (social crawler bypass) e contingência com Playwright e API pública.
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
        """Localiza valores em R$ no texto bruto."""
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

    def _extrair_via_ssr(self, url: str) -> Optional[ScrapedItem]:
        """Extração direta e ultrarrápida do HTML SSR com bypass de verificação."""
        try:
            logger.info(f"[Shopee - SSR] Consultando com perfil social: {url}")
            cookie_str = os.getenv("SHOPEE_COOKIES", "").strip()
            cookies = cookies_to_dict(cookie_str) if cookie_str else None

            resp = requests.get(url, headers=self.HEADERS_SSR, cookies=cookies, timeout=15)
            if resp.status_code != 200 or "verify/traffic/error" in resp.url:
                logger.debug("[Shopee - SSR] Bloqueado ou redirecionado.")
                return None

            soup = BeautifulSoup(resp.text, "html.parser")
            itens = []

            for a in soup.find_all("a", href=True):
                href = a["href"]
                if "-i." in href or "/product/" in href:
                    card_text = a.get_text(separator=" ", strip=True)
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
                logger.info(f"[Shopee - SSR] Menor preço encontrado: R$ {menor.preco:.2f} - '{menor.titulo[:40]}...'")
                return menor

        except Exception as e:
            logger.debug(f"[Shopee - SSR] Erro: {e}")

        return None

    def _extrair_via_playwright(self, url: str) -> Optional[ScrapedItem]:
        """Contingência com navegador Playwright."""
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            return None

        cookie_str = os.getenv("SHOPEE_COOKIES", "").strip()

        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-blink-features=AutomationControlled",
                    ],
                )
                context = browser.new_context(
                    user_agent=self.HEADERS_STANDARD["User-Agent"],
                    viewport={"width": 1366, "height": 768},
                    locale="pt-BR",
                )
                if cookie_str:
                    pw_cookies = parse_cookie_string(cookie_str, ".shopee.com.br")
                    if pw_cookies:
                        context.add_cookies(pw_cookies)

                page = context.new_page()
                page.goto(url, wait_until="domcontentloaded", timeout=25000)

                try:
                    page.wait_for_selector('div[data-sqe="item"], div.shopee-search-item-result__item', timeout=8000)
                except Exception:
                    pass

                page.evaluate("window.scrollBy(0, 600)")
                page.wait_for_timeout(1500)

                cards = page.query_selector_all('div[data-sqe="item"], div.shopee-search-item-result__item')
                itens = []

                for card in cards:
                    try:
                        link_handle = card if card.get_attribute("href") else card.query_selector('a[data-sqe="link"], a')
                        if not link_handle:
                            continue
                        href = link_handle.get_attribute("href")
                        if not href:
                            continue

                        link_completo = href if href.startswith("http") else f"https://shopee.com.br{href}"
                        titulo_elem = card.query_selector('div[data-sqe="name"], .whitespace-normal')
                        titulo = titulo_elem.inner_text().strip() if titulo_elem else card.inner_text().split("\n")[0].strip()

                        preco = self._parse_preco_string(card.inner_text())
                        if preco and preco > 0 and titulo:
                            itens.append(
                                ScrapedItem(
                                    titulo=titulo[:120],
                                    preco=preco,
                                    link=link_completo.split("?")[0],
                                    plataforma="Shopee",
                                )
                            )
                    except Exception:
                        continue

                browser.close()
                if itens:
                    menor = min(itens, key=lambda x: x.preco)
                    logger.info(f"[Shopee - Playwright] Menor preço encontrado: R$ {menor.preco:.2f}")
                    return menor

        except Exception as e:
            logger.debug(f"[Shopee - Playwright] Erro: {e}")

        return None

    def extrair_menor_preco(self, url: str) -> Optional[ScrapedItem]:
        logger.info(f"[Shopee] Buscando URL: {url}")
        # 1. Tenta SSR (mais rápido e resiliente a bots)
        resultado = self._extrair_via_ssr(url)
        if not resultado:
            logger.info("[Shopee] Tentando extração via contingência de navegador Playwright...")
            resultado = self._extrair_via_playwright(url)

        if resultado:
            logger.info(f"[Shopee] Menor preço encontrado: R$ {resultado.preco:.2f} - '{resultado.titulo[:40]}...'")
        else:
            logger.warning("[Shopee] Não foi possível obter preço.")

        return resultado
