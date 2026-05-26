const track = document.getElementById('gameTrack');
const scoreDisplay = document.getElementById('score');
const cargoDisplay = document.getElementById('cargo');

// Configurações do Jogo
const trackWidth = track.clientWidth;
let playerX = 100; // Posição inicial do jogador
const playerSpeed = 15;
let score = 0;
let cargo = 0;
const maxCargo = 3;

// Estados das entidades
let crops = [];
let pests = [];

// Criar o elemento do jogador (Trator)
const player = document.createElement('div');
player.className = 'player';
player.innerText = '🚜';
track.appendChild(player);

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
}
updatePlayerPosition();

// Movimentação
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        if (playerX < trackWidth - 30) playerX += playerSpeed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (playerX > 40) playerX -= playerSpeed; // Não ultrapassa o Silo
    }
    
    updatePlayerPosition();
    checkCollisions();
});

// Função para gerar plantas em posições aleatórias da linha
function spawnCrop() {
    if (crops.length >= 4) return; // Limite de plantas na tela

    const cropX = Math.random() * (trackWidth - 150) + 100;
    const cropElement = document.createElement('div');
    cropElement.className = 'crop';
    cropElement.innerText = '🌱'; // Começa como broto
    cropElement.style.left = `${cropX}px`;
    track.appendChild(cropElement);

    const cropObj = {
        element: cropElement,
        x: cropX,
        isRipe: false
    };

    crops.push(cropObj);

    // Tempo para a planta crescer e ficar madura (2 segundos)
    setTimeout(() => {
        if (crops.includes(cropObj)) {
            cropObj.isRipe = true;
            cropObj.element.innerText = '🌽'; // Virou milho pronto para colher
            cropObj.element.classList.add('ripe');
        }
    }, 2000);
}

// Função para gerar pragas (lagartas) na linha
function spawnPest() {
    if (pests.length >= 2) return;

    const pestX = Math.random() * (trackWidth - 150) + 120;
    const pestElement = document.createElement('div');
    pestElement.className = 'pest';
    pestElement.innerText = '🐛';
    pestElement.style.left = `${pestX}px`;
    track.appendChild(pestElement);

    const pestObj = { element: pestElement, x: pestX };
    pests.push(pestObj);

    // A lagarta some depois de 4 segundos se não for tocada
    setTimeout(() => {
        if (pests.includes(pestObj)) {
            pestElement.remove();
            pests = pests.filter(p => p !== pestObj);
        }
    }, 4000);
}

// Checagem de colisões na linha 1D
function checkCollisions() {
    // 1. Colisão com o Silo (entrega da colheita)
    if (playerX <= 60 && cargo > 0) {
        score += cargo * 10;
        cargo = 0;
        scoreDisplay.innerText = score;
        cargoDisplay.innerText = cargo;
        createFloatingText(40, '+$', '#2e7d32');