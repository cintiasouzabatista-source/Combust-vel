let abastecimentos = JSON.parse(localStorage.getItem('abastecimentos') || '[]');
let manutencoes = JSON.parse(localStorage.getItem('manutencoes') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    const aData = document.getElementById('aData');
    if (aData) aData.valueAsDate = new Date();
    
    renderAbast();
    renderManut();
    calcularKPIs();
    trocarAba('painel'); // Inicializa na aba correta
});

// FUNÇÃO CORRIGIDA
function trocarAba(abaId) {
    // 1. Esconde todas as abas
    document.querySelectorAll('.aba').forEach(s => s.classList.remove('active'));
    // 2. Remove classe active de todos os botões
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    
    // 3. Mostra a aba alvo
    const secaoAlvo = document.getElementById(abaId);
    if (secaoAlvo) secaoAlvo.classList.add('active');
    
    // 4. Marca o botão correto como ativo
    const botoes = document.querySelectorAll('.tabs button');
    botoes.forEach(btn => {
        // Verifica se o onclick do botão contém o nome da aba
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(abaId)) {
            btn.classList.add('active');
        }
    });
}

// ... (mantenha o restante das suas funções de addAbast, render, etc, aqui abaixo)
