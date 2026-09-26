/**
 * affiliate.js
 * Utilitário oficial de links de afiliados e compartilhamento viral.
 */

const AffiliateManager = {
  defaultMeliTool: '34127116',
  defaultMeliWord: 'fabiovmarques',
  defaultShopeeTag: '',
  siteUrl: 'https://www.labkids.online/pesquisa/',

  async init() {
    try {
      const res = await fetch('/api/pesquisa/afiliados?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data.meli_tool) localStorage.setItem('meli_tool', data.meli_tool);
        if (data.meli_word) localStorage.setItem('meli_word', data.meli_word);
        if (data.shopee_tag) localStorage.setItem('shopee_tag', data.shopee_tag);
      }
    } catch (e) {}
  },

  getMeliTool() {
    return localStorage.getItem('meli_tool') || this.defaultMeliTool;
  },

  getMeliWord() {
    return localStorage.getItem('meli_word') || this.defaultMeliWord;
  },

  getShopeeTag() {
    return localStorage.getItem('shopee_tag') || this.defaultShopeeTag;
  },

  converter(url, plataforma = '') {
    if (!url || typeof url !== 'string') return '#';
    const uStr = url.trim();

    const isMeli = plataforma === 'Mercado Livre' || 
                   uStr.includes('mercadolivre.com') || 
                   uStr.includes('mercadolibre.com');

    const isShopee = plataforma === 'Shopee' || 
                     uStr.includes('shopee.com');

    if (isMeli) {
      const tool = this.getMeliTool();
      const word = this.getMeliWord();
      try {
        const u = new URL(uStr);
        u.searchParams.set('matt_tool', tool);
        u.searchParams.set('matt_word', word);
        u.searchParams.set('tracking_id', tool);
        u.searchParams.set('forceInApp', 'true');
        return u.toString();
      } catch (e) {
        return uStr;
      }
    }

    if (isShopee) {
      const tag = this.getShopeeTag();
      if (!tag) return uStr;
      try {
        const u = new URL(uStr);
        u.searchParams.set('af_siteid', tag);
        u.searchParams.set('af_sub_siteid', 'labkids');
        return u.toString();
      } catch (e) {
        return uStr;
      }
    }

    return uStr;
  },

  gerarTextoCompartilhamento(prod) {
    if (!prod) return '';
    const nome = prod.nome_produto || 'Produto em Promoção';
    const pAtual = prod.preco_atual || prod.preco_inicial || 0;
    const pInicial = prod.preco_inicial || pAtual;
    const rawUrl = prod.url_pesquisa || 'https://www.mercadolivre.com.br';
    const plataforma = prod.plataforma || 'Mercado Livre';
    const linkAfiliado = this.converter(rawUrl, plataforma);
    const nomeLoja = plataforma.includes('Shopee') ? 'Shopee' : 'Mercado Livre';

    let textoPreco = '';
    if (prod.indisponivel) {
      textoPreco = '⚠️ *Produto atualmente indisponível no ML (acompanhe o retorno do estoque)*';
    } else if (pInicial > pAtual && pAtual > 0) {
      const economia = (pInicial - pAtual).toFixed(2).replace('.', ',');
      textoPreco = `💰 De ~R$ ${pInicial.toFixed(2).replace('.', ',')}~ por apenas *R$ ${pAtual.toFixed(2).replace('.', ',')}* (Economia de R$ ${economia})!`;
    } else if (pAtual > 0) {
      textoPreco = `💰 Por apenas *R$ ${pAtual.toFixed(2).replace('.', ',')}*!`;
    } else {
      textoPreco = `💰 Menor preço monitorado em tempo real!`;
    }

    return `🔥 *Olha essa oferta que encontrei!*

` +
           `📦 *${nome}*
` +
           `${textoPreco}

` +
           `🎯 *Fiz um alerta grátis no site:* ${this.siteUrl} e acompanho as quedas de preço!

` +
           `🛒 *Aproveite no ${nomeLoja}:*
${linkAfiliado}`;
  },

  compartilharWhatsApp(prod) {
    const texto = this.gerarTextoCompartilhamento(prod);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  compartilharTelegram(prod) {
    const texto = this.gerarTextoCompartilhamento(prod);
    const url = `https://t.me/share/url?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  async copiarTextoCompartilhamento(prod) {
    const texto = this.gerarTextoCompartilhamento(prod);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(texto);
        return true;
      }
    } catch (e) {}
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
};

AffiliateManager.init();
window.AffiliateManager = AffiliateManager;
