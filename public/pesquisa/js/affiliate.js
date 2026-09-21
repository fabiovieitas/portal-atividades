/**
 * affiliate.js
 * Utilitário de conversão oficial para links de afiliados (Mercado Livre e Shopee).
 * Credenciais Oficiais:
 * - matt_tool: 34127116
 * - matt_word: fabiovmarques
 * - tracking_id: 34127116
 * - forceInApp: true
 */

const AffiliateManager = {
  defaultMeliTool: '34127116',
  defaultMeliWord: 'fabiovmarques',
  defaultShopeeTag: '',

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

  /**
   * Converte qualquer URL de produto para o link oficial de afiliado.
   */
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
  }
};

AffiliateManager.init();
