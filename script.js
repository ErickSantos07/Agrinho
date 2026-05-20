
let lote1 = {
    status: "vazio", // pode ser "broto", "pronto", "com_praga"
    cultura: "nenhuma",
    regado: false
};
// Estado inicial do Lote 1
let lote1 = {
    status: "broto",
    tempoCrescimento: 0,
    tempoParaColher: 10, // precisa de 10 segundos
    regado: true
};

// Esse loop roda a cada 1 segundo (1000 milissegundos)
setInterval(function() {
    
    // Se tiver planta e a terra estiver molhada, ela cresce
    if (lote1.status === "broto" && lote1.regado === true) {
        lote1.tempoCrescimento++;
        console.log("A planta está crescendo... Tempo: " + lote1.tempoCrescimento + "s");
        
        // Se atingiu o tempo necessário, ela fica pronta
        if (lote1.tempoCrescimento >= lote1.tempoParaColher) {
            lote1.status = "pronto_para_colher";
            alert("A Soja está pronta para a colheita sustentável!");
            // Aqui você mudaria a imagem do lote via código para a planta grande
        }
    }
    
}, 1000);