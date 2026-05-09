require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const updatedContent = `Olá, exploradores do conhecimento!<br><br>

Vivemos em uma era onde a tecnologia não é mais apenas uma ferramenta, mas sim uma extensão da nossa criatividade. Se você já se perguntou como seria ter um tutor personalizado disponível 24 horas por dia, ou como criar projetos complexos de robótica com apenas alguns comandos, a resposta já está entre nós: a <strong>Inteligência Artificial (IA)</strong>.<br><br>

Muitos ainda olham para a IA com receio, mas aqui no <strong>Lab Kids</strong>, nós a vemos como um "superpoder" pedagógico. Mas afinal, como isso funciona na prática dentro da sala de aula?<br><br>

<div style="text-align:center; margin: 30px 0;">
    <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" style="border-radius: 20px; max-width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" alt="Robótica e IA">
    <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">A robótica e a IA trabalhando juntas na educação.</p>
</div><br>

<h3 style="color: #4f46e5; margin-top: 30px;">1. Personalização em Tempo Real</h3>
Cada aluno tem seu ritmo. Enquanto alguns dominam a lógica de programação rapidamente, outros brilham na montagem estrutural de um robô. A IA nos permite criar trilhas de aprendizado que se adaptam a cada perfil, garantindo que ninguém fique para trás e que todos sejam desafiados na medida certa.<br><br>

<h3 style="color: #4f46e5; margin-top: 30px;">2. O Fim das Dúvidas Infinitas</h3>
Imagine um aluno em casa, tentando resolver um desafio de lógica. Com assistentes inteligentes, ele pode receber dicas, explicações em diferentes linguagens e até exemplos práticos sem precisar esperar pela aula seguinte. Isso gera autonomia e confiança!<br><br>

<h3 style="color: #4f46e5; margin-top: 30px;">3. Criatividade Sem Fronteiras</h3>
A IA ajuda a tirar as ideias do papel. Quer criar um roteiro para um jogo? Ou entender como um sensor ultrassônico funciona em um ambiente de Marte? A tecnologia nos ajuda a simular esses cenários de forma imersiva e prazerosa.<br><br>

<h3 style="color: #4f46e5; margin-top: 30px;">Conclusão</h3>
O futuro da educação não é sobre substituir o professor, mas sobre dar a ele "braços biônicos" para alcançar cada estudante de forma única. A tecnologia está aqui para humanizar o aprendizado, tornando-o mais acessível, divertido e, acima de tudo, inspirador.<br><br>

Vamos juntos nessa jornada rumo ao futuro?<br><br>

<strong>Professor Fábio Vieitas Marques</strong><br>
Especialista em Tecnologias Educacionais`;

async function update() {
    console.log('Atualizando notícia id: 1...');
    const { data, error } = await supabase
        .from('news')
        .update({ content: updatedContent })
        .eq('id', 1);
        
    if (error) {
        console.error('Erro ao atualizar:', error.message);
    } else {
        console.log('Notícia atualizada com sucesso! 🎉');
    }
}

update();
