// Variáveis Globais do Jogador
let moedas = 100;
let aguaCisterna = 50;
let sustentabilidade = 100;

// Configuração dos 5 lotes da nossa Linha 1D
let lotes = [
    { id: 0, status: "vazio", progresso: 0, regado: true, temPraga: false },
    { id: 1, status: "vazio", progresso: 0, regado: true, temPraga: false },
    { id: 2, status: "vazio", progresso: 0, regado: true, temPraga: false },
    { id: 3, status: "vazio", progresso: 0, regado: true, temPraga: false },
    { id: 4, status: "vazio", progresso: 0, regado: true, temPraga: false }
];

// Inicializar o Jogo ao carregar a página
window.onload = function() {
    renderizarFazenda();
    // Loop Principal do Jogo: Roda a cada 1 segundo (1000ms)
    setInterval(gameLoop, 1000);
};

// Desenha a linha de lotes na tela de forma atualizada
function renderizarFazenda() {
    const fazendaDiv = document.getElementById("fazenda");
    fazendaDiv.innerHTML = ""; // Limpa a linha para redesenhar

    lotes.forEach(lote => {
        const loteDiv = document.createElement("div");
        loteDiv.classList.add("lote");

        // Aplica as classes CSS dependendo do estado em tempo real
        if (!lote.regado) loteDiv.classList.add("seco");
        if (lote.status === "pronto") loteDiv.classList.add("pronto");
        if (lote.temPraga) loteDiv.classList.add("com-praga");

        // Define o texto que aparece dentro do bloco 1D
        let conteudoHTML = `<strong>Lote ${lote.id + 1}</strong>`;
        
        if (lote.temPraga) {
            conteudoHTML += `<span>🐛 PRAGA!</span>`;
        } else if (lote.status === "vazio") {
            conteudoHTML += `<span>🟫 Terra Vazia<br><small>(Clique para Plantar)</small></span>`;
        } else if (lote.status === "crescendo") {
            conteudoHTML += `<span>🌱 Crescendo: ${lote.progresso}%</span>`;
        } else if (lote.status === "pronto") {
            conteudoHTML += `<span>🌾 PRONTO!<br><small>(Clique para Colher)</small></span>`;
        }

        conteudoHTML += `<span>${lote.regado ? "💧 Úmido" : "🍂 Seco"}</span>`;
        
        loteDiv.innerHTML = conteudoHTML;
        
        // Define a ação do