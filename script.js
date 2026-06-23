let abastecimentos = JSON.parse(localStorage.getItem('abastecimentos') || '[]');
let manutencoes = JSON.parse(localStorage.getItem('manutencoes') || '[]');

// Função de troca de aba simplificada e robusta
function trocarAba(aba) {
    // Esconder todas as abas
    document.querySelectorAll('.aba').forEach(s => s.classList.remove('active'));
    // Remover classe active dos botões
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    
    // Mostrar a aba alvo
    document.getElementById(aba).classList.add('active');
    
    // Marcar botão correspondente
    document.querySelectorAll('.tabs button').forEach(btn => {
        if (btn.getAttribute('onclick').includes(aba)) {
            btn.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização segura
    const dataInput = document.getElementById('aData');
    if(dataInput) dataInput.valueAsDate = new Date();
    
    renderAbast();
    renderManut();
    calcularKPIs();
    trocarAba('painel'); // Força a aba inicial
});

function salvar() {
    localStorage.setItem('abastecimentos', JSON.stringify(abastecimentos));
    localStorage.setItem('manutencoes', JSON.stringify(manutencoes));
}

// ... restam as funções de addAbast, renderAbast, etc ...
