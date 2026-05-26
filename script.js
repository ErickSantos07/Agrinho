// Configuração da Linha 1D
const LINE_SIZE = 8;
let coins = 20;
let seeds = 5;
let currentTool = 'plant'; // Ferramenta padrão inicial

// Estrutura de cada lote da fazenda
let farmLine = Array.from({ length: LINE_SIZE }, () => ({
    status: 'empty',       // 'empty', 'planted', 'growing', 'ready'
    watered: false,
    hasWeed: false,        // Presença de pragas/ervas daninhas
    modifier: 1.0          // Multiplicador de rendimento (Biofertilizante aumenta, Herbicida reduz)
}));

// Elementos da Interface
const farmLineDOM = document.getElementById('farm-line');
const coinsDOM = document.getElementById('coins');
const seedsDOM = document.getElementById('seeds');
const toolButtons = document.querySelectorAll('.tool-btn, .tool-btn-special');

// Inicialização
function init() {
    render();
    setupTools();
    
    // Loops do Jogo
    setInterval(gameLoop, 2000); // Crescimento a cada 2 segundos
    setInterval(spawnWeeds, 7000); // Chance de nascer praga a cada 7 segundos
}

// Configura o seletor de ferramentas do mouse
function setupTools() {
    toolButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            toolButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.id.replace('tool-', '');
        });
    });

    document.getElementById('btn-buy-seed').addEventListener('click', () => {
        if (coins >= 2) {
            coins -= 2;
            seeds++;
            render();
        }
    });
}

// Renderiza a linha de terrenos e status
function render() {
    coinsDOM.innerText = coins;
    seedsDOM.innerText = seeds;
    farmLineDOM.innerHTML = '';

    farmLine.forEach((plot, index) => {
        const plotDiv = document.createElement('div');
        plotDiv.classList.add('plot');
        
        // Estado da água
        plotDiv.classList.add(plot.watered ? 'wet' : 'dry');
        
        // Estado de Erva Daninha
        if (plot.hasWeed) {
            plotDiv.classList.add('has-weed');
        }

        // Definir exibição gráfica (Emojis)
        let emoji = '🟫'; // Terra vazia
        if (plot.hasWeed && plot.status === 'empty') emoji = '🌿'; // Só mato crescendo
        else if (plot.status === 'planted') emoji = '🌱';
        else if (plot.status === 'growing') emoji = '🥦';
        else if (plot.status === 'ready') emoji = '🌾';

        plotDiv.innerText = emoji;

        // Indicadores de modificadores de rendimento (texto pequeno abaixo do bloco)
        if (plot.modifier > 1.0 && plot.status !== 'empty') {
            const ind = document.createElement('span');
            ind.classList.add('indicator');
            ind.innerText = 'BIO ✨';
            plotDiv.appendChild(ind);
        } else if (plot.modifier < 1.0 && plot.status !== 'empty') {
            const ind = document.createElement('span');
            ind.classList.add('indicator');
            ind.innerText = 'HERB ⚠️';
            plotDiv.appendChild(ind);
        } else if (plot.hasWeed && plot.status !== 'empty') {
            const ind = document.createElement('span');
            ind.classList.add('indicator');
            ind.innerText = 'PRAGA 🐛';
            plotDiv.appendChild(ind);
        }

        // Evento de Clique com o mouse direto no lote
        plotDiv.addEventListener('click', () => handlePlotClick(index));

        farmLineDOM.appendChild(plotDiv);
    });
}

// Executa a ação da ferramenta selecionada no lote clicado
function handlePlotClick(index) {
    let plot = farmLine[index];

    switch (currentTool) {
        case 'plant':
            if (plot.status === 'empty' && !plot.hasWeed && seeds > 0) {
                plot.status = 'planted';
                plot.modifier = 1.0; // Reseta modificador
                seeds--;
            }
            break;

        case 'water':
            if (plot.status !== 'empty' && !plot.watered) {
                plot.watered = true;
            }
            break;

        case 'bio':
            // Custa 5 moedas. Só pode aplicar se tiver planta e se já não tiver herbicida/bio aplicado
            if (coins >= 5 && plot.status !== 'empty' && plot.modifier === 1.0) {
                coins -= 5;
                plot.modifier = 1.6; // Aumenta o rendimento em 60%
            }
            break;

        case 'herb':
            // Herbicida gasta 3 moedas. Limpa a praga mas reduz a produtividade do lote atual
            if (coins >= 3 && plot.hasWeed) {
                coins -= 3;
                plot.hasWeed = false;
                plot.modifier = 0.7; // Perde 30% de rendimento na colheita
            }
            break;

        case 'harvest':
            if (plot.status === 'ready') {
                // Base de rendimento: 5 moedas
                let baseYield = 5;
                
                // Se colher com praga junto, perde muito rendimento
                if (plot.hasWeed) {
                    baseYield -= 3;
                }

                // Cálculo final aplicando o modificador (Biofertilizante ou Herbicida)
                let finalYield = Math.max(1, Math.round(baseYield * plot.modifier));
                
                coins += finalYield;
                
                // Limpa o terreno pós-colheita
                plot.status = 'empty';
                plot.watered = false;
                plot.modifier = 1.0;
            }
            break;
    }
    render();
}

// Ciclo de crescimento temporal
function gameLoop() {
    farmLine.forEach((plot) => {
        // Se tem praga, ela atrasa ou impede o crescimento saudável se não usar herbicida
        let weedBlock = plot.hasWeed ? 0.3 : 1.0; 

        if (plot.status === 'planted' && plot.watered) {
            if (Math.random() < weedBlock) {
                plot.status = 'growing';
                plot.watered = false; // Consome a água
            }
        } else if (plot.status === 'growing') {
            if (Math.random() < weedBlock) {
                plot.status = 'ready';
            }
        }
    });
    render();
}

// Geração aleatória de Ervas Daninhas / Pragas
function spawnWeeds() {
    // Escolhe um lote aleatório para infectar com praga
    let randomIndex = Math.floor(Math.random() * LINE_SIZE);
    farmLine[randomIndex].hasWeed = true;
    render();
}

// Iniciar o game ao carregar a página
window.onload = init;