require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Agendando para as 15:00 do dia 09/05/2026 (Horário do usuário)
const scheduledTime = '2026-05-09T15:00:00-03:00';

const article = {
    title: '5 Ferramentas Poderosas de IA para Turbinar seu Estudo Hoje Mesmo',
    summary: 'A Inteligência Artificial não serve apenas para conversar. Conheça 5 ferramentas que vão transformar a sua forma de pesquisar, escrever e criar projetos escolares.',
    content: `Se você acha que a Inteligência Artificial serve apenas para tirar dúvidas rápidas, prepare-se para mudar de ideia. Existem ferramentas incríveis que funcionam como verdadeiros "copilotos" para estudantes e professores.<br><br>

Aqui estão as 5 melhores que você precisa conhecer agora:<br><br>

<h3 style="color: #4f46e5;">1. Google Gemini (Análise de Documentos)</h3>
O Gemini é excelente para resumir textos longos ou explicar conceitos complexos de livros didáticos. Basta colar o texto e pedir: "Explique isso como se eu tivesse 10 anos".<br><br>

<h3 style="color: #4f46e5;">2. Canva Magic Edit (Design Criativo)</h3>
Precisa de uma imagem específica para um trabalho e não acha? O Magic Edit do Canva cria imagens do zero usando IA. É perfeito para ilustrar projetos de robótica e feiras de ciências.<br><br>

<div style="text-align:center; margin: 30px 0;">
    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" style="border-radius: 20px; max-width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" alt="IA e Tecnologia">
    <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">A IA é a nova fronteira do conhecimento escolar.</p>
</div><br>

<h3 style="color: #4f46e5;">3. Perplexity AI (Pesquisa com Fontes)</h3>
Diferente de outras IAs, a Perplexity cita de onde tirou a informação. Isso é fundamental para trabalhos escolares sérios, garantindo que a fonte seja confiável.<br><br>

<h3 style="color: #4f46e5;">4. Gamma.app (Apresentações Instantâneas)</h3>
O Gamma cria apresentações de slides completas em segundos. Você dá o tema, e ele monta o design e o conteúdo. Depois, é só você personalizar com o seu toque especial.<br><br>

<h3 style="color: #4f46e5;">5. Wolfram Alpha (O gênio da Matemática)</h3>
Se o problema envolve cálculos complexos ou física, o Wolfram Alpha é imbatível. Ele mostra o passo a passo da resolução, ajudando você a entender o processo por trás do resultado.<br><br>

<strong>Conclusão</strong><br>
A tecnologia está aqui para expandir nossa mente, não para substituir nosso esforço. Use essas ferramentas com sabedoria e veja seus resultados decolarem!<br><br>

<strong>Professor Fábio Vieitas Marques</strong><br>
Especialista em Tecnologias Educacionais`,
    image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    category: 'Tecnologia',
    author: 'Professor Fábio Vieitas Marques',
    published_at: scheduledTime
};

async function scheduleNews() {
    console.log('Agendando notícia para ' + scheduledTime + '...');
    const { data, error } = await supabase.from('news').insert(article);
    if (error) {
        console.error('Erro ao agendar:', error.message);
    } else {
        console.log('Notícia agendada com sucesso! 🚀📅');
        console.log('Ela aparecerá no site exatamente às 15:00.');
    }
}

scheduleNews();
