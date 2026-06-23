// 1. Variáveis Globais
let abastecimentos = JSON.parse(localStorage.getItem('abastecimentos') || '[]');
let manutencoes = JSON.parse(localStorage.getItem('manutencoes') || '[]');

// 2. Definição das Funções PRIMEIRO
function renderAbast() {
    console.log("Renderizando abastecimentos...");
    const lista = document.getElementById('listaAbast');
    // ... restante do código da sua função
}

function renderManut() {
    console.log("Renderizando manutenções...");
    // ... restante do código da sua função
}

function calcularKPIs() {
    // ... restante do código
}

function trocarAba(aba) {
    // ... (use a versão robusta que enviamos anteriormente)
}

// 3. Só depois de todas as funções estarem declaradas, chamamos o evento:
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado, iniciando...");
    
    // Verificação de segurança para elementos do HTML
    const aData = document.getElementById('aData');
    if (aData) aData.valueAsDate = new Date();
    
    renderAbast();
    renderManut();
    calcularKPIs();
    trocarAba('painel');
});
