"""
Módulo Base de Scraping.
Define o modelo de dados padronizado e a interface base para os scrapers de e-commerce.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
import os
from typing import Optional, List, Dict


@dataclass
class ScrapedItem:
    """Modelo de dados para o produto com menor preço encontrado."""
    titulo: str
    preco: float
    link: str
    plataforma: str

    def __str__(self) -> str:
        return f"[{self.plataforma}] {self.titulo} - R$ {self.preco:.2f}"


def parse_cookie_string(cookie_str: str, domain: str) -> List[Dict[str, str]]:
    """
    Converte uma string de cookies no formato 'chave1=valor1; chave2=valor2'
    para o formato de lista de dicionários aceito pelo Playwright.
    """
    if not cookie_str:
        return []

    cookies = []
    for parte in cookie_str.split(";"):
        parte = parte.strip()
        if not parte or "=" not in parte:
            continue
        nome, valor = parte.split("=", 1)
        cookies.append(
            {
                "name": nome.strip(),
                "value": valor.strip(),
                "domain": domain,
                "path": "/",
            }
        )
    return cookies


def cookies_to_dict(cookie_str: str) -> Dict[str, str]:
    """Converte string de cookies para dicionário aceito pela biblioteca requests."""
    resultado = {}
    if not cookie_str:
        return resultado
    for parte in cookie_str.split(";"):
        parte = parte.strip()
        if not parte or "=" not in parte:
            continue
        nome, valor = parte.split("=", 1)
        resultado[nome.strip()] = valor.strip()
    return resultado


class BaseScraper(ABC):
    """Interface abstrata que todo scraper deve implementar."""

    @abstractmethod
    def extrair_menor_preco(self, url: str) -> Optional[ScrapedItem]:
        """
        Navega até a URL da pesquisa com filtros, extrai os itens da listagem
        e retorna o ScrapedItem correspondente ao menor preço válido.

        :param url: URL da página de pesquisa com filtros aplicados.
        :return: Instância de ScrapedItem ou None caso nenhum item válido seja encontrado.
        """
        pass
