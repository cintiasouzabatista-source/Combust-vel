let abastecimentos = JSON.parse(localStorage.getItem('abastecimentos') || '[]');
let manutencoes = JSON.parse(localStorage.getItem('manutencoes') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('aData').valueAsDate = new Date();
    renderAbast();
    renderManut();
    calcularKPIs();
    
    // Auto-cálculo de valor total
    document.getElementById('aLitros').addEventListener('input', calcularAutoTotal);
    document.getElementById('aValorL').addEventListener('input', calcularAutoTotal);
});

function calcularAutoTotal() {
    const l = parseFloat(document.getElementById('aLitros').value) || 0;
    const v = parseFloat(document.getElementById('aValorL').value) || 0;
    document.getElementById('aTotal').value = (l * v).toFixed(2);
}

function trocarAba(aba) {
    document.querySelectorAll('.aba').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById(aba).classList.add('active');
    
    document.querySelectorAll('.tabs button').forEach(btn => {
        if (btn.getAttribute('onclick').includes(aba)) btn.classList.add('active');
    });
}

function salvar() {
    localStorage.setItem('abastecimentos', JSON.stringify(abastecimentos));
    localStorage.setItem('manutencoes', JSON.stringify(manutencoes));
}

function addAbast() {
    const data = document.getElementById('aData').value;
    const km = parseInt(document.getElementById('aKm').value);
    const litros = parseFloat(document.getElementById('aLitros').value);
    const valorL = parseFloat(document.getElementById('aValorL').value);
    const total = parseFloat(document.getElementById('aTotal').value);
    const tipo = document.getElementById('aTipo').value;

    if (!data || !km || !litros || !valorL || !total) return alert('Preencha tudo!');

    abastecimentos.push({ id: Date.now(), data, km, litros, valorL, total, tipo });
    abastecimentos.sort((a,b) => new Date(a.data) - new Date(b.data));
    salvar();
    renderAbast();
    calcularKPIs();
}

function renderAbast() {
    const lista = document.getElementById('listaAbast');
    const ultimos = document.getElementById('ultimosAbast');
    
    lista.innerHTML = abastecimentos.slice().reverse().map(a => `
        <div class="item">
            <p><b>${a.data}</b> - ${a.km} km</p>
            <button class="btn-del" onclick="delAbast(${a.id})"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');

    if (ultimos) {
        ultimos.innerHTML = abastecimentos.slice(-3).reverse().map(a => 
            `<div class="item-small">${a.data} - ${a.km}km</div>`
        ).join('');
    }
}

function delAbast(id) {
    abastecimentos = abastecimentos.filter(a => a.id !== id);
    salvar();
    renderAbast();
    calcularKPIs();
}

function calcularKPIs() {
    const total = abastecimentos.reduce((s, a) => s + a.total, 0);
    document.getElementById('totalGasto').textContent = `R$ ${total.toFixed(2)}`;
    
    const kmAtual = abastecimentos.length ? abastecimentos[abastecimentos.length - 1].km : 0;
    document.getElementById('kmAtual').textContent = `${kmAtual} km`;
}

function toggleTheme() {
    document.body.classList.toggle('light');
    const icon = document.getElementById('theme-icon');
    icon.className = document.body.classList.contains('light') ? 'fas fa-sun' : 'fas fa-moon';
}
