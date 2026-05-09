require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const article = {
    title: 'O Futuro na Sala de Aula: Como a Inteligência Artificial está Transformando o Aprendizado',
    summary: 'Descubra como a IA deixou de ser ficção científica para se tornar a melhor aliada de professores e alunos na busca por um conhecimento mais dinâmico e personalizado.',
    content: `Olá, exploradores do conhecimento!

Vivemos em uma era onde a tecnologia não é mais apenas uma ferramenta, mas sim uma extensão da nossa criatividade. Se você já se perguntou como seria ter um tutor personalizado disponível 24 horas por dia, ou como criar projetos complexos de robótica com apenas alguns comandos, a resposta já está entre nós: a **Inteligência Artificial (IA)**.

Muitos ainda olham para a IA com receio, mas aqui no **Lab Kids**, nós a vemos como um "superpoder" pedagógico. Mas afinal, como isso funciona na prática dentro da sala de aula?

#### 1. Personalização em Tempo Real
Cada aluno tem seu ritmo. Enquanto alguns dominam a lógica de programação rapidamente, outros brilham na montagem estrutural de um robô. A IA nos permite criar trilhas de aprendizado que se adaptam a cada perfil, garantindo que ninguém fique para trás e que todos sejam desafiados na medida certa.

#### 2. O Fim das Dúvidas Infinitas
Imagine um aluno em casa, tentando resolver um desafio de lógica. Com assistentes inteligentes, ele pode receber dicas, explicações em diferentes linguagens e até exemplos práticos sem precisar esperar pela aula seguinte. Isso gera autonomia e confiança!

#### 3. Criatividade Sem Fronteiras
A IA ajuda a tirar as ideias do papel. Quer criar um roteiro para um jogo? Ou entender como um sensor ultrassônico funciona em um ambiente de Marte? A tecnologia nos ajuda a simular esses cenários de forma imersiva e prazerosa.

#### Conclusão
O futuro da educação não é sobre substituir o professor, mas sobre dar a ele "braços biônicos" para alcançar cada estudante de forma única. A tecnologia está aqui para humanizar o aprendizado, tornando-o mais acessível, divertido e, acima de tudo, inspirador.

Vamos juntos nessa jornada rumo ao futuro?

**Professor Fábio Vieitas Marques**
*Especialista em Tecnologias Educacionais*`,
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    category: 'Inovação',
    author: 'Professor Fábio Vieitas Marques'
};

async function post() {
    console.log('Postando notícia no Supabase...');
    const { data, error } = await supabase.from('news').insert(article);
    if (error) {
        console.error('Erro ao postar:', error.message);
    } else {
        console.log('Notícia postada com sucesso! 🎉');
    }
}

post();
