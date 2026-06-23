let abastecimentos = JSON.parse(localStorage.getItem('abastecimentos') || '[]');
let manutencoes = JSON.parse(localStorage.getItem('manutencoes') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    const dataInput = document.getElementById('aData');
    if (dataInput) dataInput.valueAsDate = new Date();
    
    renderAbast();
    renderManut();
    calcularKPIs();
    trocarAba('painel');
});

// ===== TABS =====
function trocarAba(aba) {
    document.querySelectorAll('.aba').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    
    const secao = document.getElementById(aba);
    if (secao) secao.classList.add('active');
    
    // Busca o botão pelo atributo onclick para marcar como ativo
    document.querySelectorAll('.tabs button').forEach(b => {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(aba)) {
            b.classList.add('active');
        }
    });
}

// ===== ABASTECIMENTO =====
function addAbast() {
    const data = document.getElementById('aData').value;
    const km = parseInt(document.getElementById('aKm').value);
    const litros = parseFloat(document.getElementById('aLitros').value);
    const valorL = parseFloat(document.getElementById('aValorL').value);
    const total = parseFloat(document.getElementById('aTotal').value);
    const tipo = document.getElementById('aTipo').value;

    if (!data || !km || !litros || !valorL || !total) {
        alert('Preencha todos os campos');
        return;
    }

    abastecimentos.push({ id: Date.now(), data, km, litros, valorL, total, tipo });
    abastecimentos.sort((a,b) => new Date(a.data) - new Date(b.data));

    salvar();
    renderAbast();
    calcularKPIs();
    limparCamposAbast();
}

function renderAbast() {
    const lista = document.getElementById('listaAbast');
    const ultimos = document.getElementById('ultimosAbast');

    if (!lista) return;

    if (!abastecimentos.length) {
        lista.innerHTML = '<p class="empty">Nenhum abastecimento lançado</p>';
        if (ultimos) ultimos.innerHTML = '<p class="muted">Sem dados</p>';
        return;
    }

    lista.innerHTML = abastecimentos.slice().reverse().map((a, idx) => {
        const realIdx = abastecimentos.length - 1 - idx;
        const anterior = abastecimentos[realIdx-1];
        const kmRodado = anterior ? a.km - anterior.km : 0;
        const media = anterior && kmRodado > 0 ? (kmRodado / a.litros).toFixed(2) : '-';

        return `
            <div class="item">
                <div>
                    <p><b>${new Date(a.data).toLocaleDateString('pt-BR')}</b> - ${a.km} km</p>
                    <p class="muted">${a.tipo} • ${a.litros}L x R$ ${a.valorL.toFixed(3)} = R$ ${a.total.toFixed(2)}</p>
                    ${media !== '-' ? `<p class="muted">Média: ${media} km/L | ${kmRodado} km rodados</p>` : ''}
                </div>
                <button class="btn-del" onclick="delAbast(${a.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');

    if (ultimos) {
        ultimos.innerHTML = abastecimentos.slice(-3).reverse().map(a => {
            return `<div class="item-small">${new Date(a.data).toLocaleDateString('pt-BR')} - ${a.km}km - R$ ${a.total.toFixed(2)}</div>`;
        }).join('');
    }
}

function delAbast(id) {
    if (confirm('Deletar este abastecimento?')) {
        abastecimentos = abastecimentos.filter(a => a.id !== id);
        salvar();
        renderAbast();
        calcularKPIs();
    }
}

function limparCamposAbast() {
    document.getElementById('aKm').value = '';
    document.getElementById('aLitros').value = '';
    document.getElementById('aValorL').value = '';
    document.getElementById('aTotal').value = '';
}

// ===== MANUTENÇÃO =====
function addManut() {
    const tipo = document.getElementById('mTipo').value;
    const km = parseInt(document.getElementById('mKm').value);
    const custo = parseFloat(document.getElementById('mCusto').value) || 0;
    const obs = document.getElementById('mObs').value;

    if (!tipo || !km) {
        alert('Preencha tipo e km');
        return;
    }

    const [nome, intervalo] = tipo.split('|');
    manutencoes.push({ id: Date.now(), nome, intervalo: parseInt(intervalo), km, custo, obs, data: new Date().toISOString() });
    manutencoes.sort((a,b) => b.km - a.km);

    salvar();
    renderManut();
    calcularKPIs();
    document.getElementById('mKm').value = '';
    document.getElementById('mCusto').value = '';
    document.getElementById('mObs').value = '';
}

function renderManut() {
    const lista = document.getElementById('listaManut');
    if (!lista) return;

    if (!manutencoes.length) {
        lista.innerHTML = '<p class="empty">Nenhuma manutenção registrada</p>';
        return;
    }

    const kmAtual = abastecimentos.length ? abastecimentos[abastecimentos.length-1].km : 0;

    lista.innerHTML = manutencoes.map(m => {
        const proxKm = m.km + m.intervalo;
        const faltam = proxKm - kmAtual;
        const status = faltam <= 0 ? 'vencida' : faltam <= 500 ? 'alerta' : 'ok';

        return `
            <div class="item ${status}">
                <div>
                    <p><b>${m.nome}</b> - Feito em ${m.km} km</p>
                    <p class="muted">Próxima: ${proxKm} km ${faltam > 0 ? `• Faltam ${faltam} km` : '• VENCIDA'}</p>
                    ${m.custo > 0 ? `<p class="muted">Custo: R$ ${m.custo.toFixed(2)}</p>` : ''}
                    ${m.obs ? `<p class="muted">Obs: ${m.obs}</p>` : ''}
                </div>
                <button class="btn-del" onclick="delManut(${m.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');
}

function delManut(id) {
    manutencoes = manutencoes.filter(m => m.id !== id);
    salvar();
    renderManut();
    calcularKPIs();
}

// ===== KPIS =====
function calcularKPIs() {
    const total = abastecimentos.reduce((s, a) => s + a.total, 0);
    const totalEl = document.getElementById('totalGasto');
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;

    const kmAtual = abastecimentos.length ? abastecimentos[abastecimentos.length-1].km : 0;
    const kmEl = document.getElementById('kmAtual');
    if (kmEl) kmEl.textContent = `${kmAtual} km`;

    let mediaGeral = 0, cont = 0;
    for (let i = 1; i < abastecimentos.length; i++) {
        const kmRodado = abastecimentos[i].km - abastecimentos[i-1].km;
        if (kmRodado > 50) {
            mediaGeral += kmRodado / abastecimentos[i].litros;
            cont++;
        }
    }
    mediaGeral = cont > 0 ? (mediaGeral / cont).toFixed(2) : 0;
    const mediaEl = document.getElementById('mediaGeral');
    if (mediaEl) mediaEl.textContent = `${mediaGeral} km/L`;

    const trocaOleo = manutencoes.filter(m => m.nome === 'Óleo Motor')[0];
    if (trocaOleo) {
        const prox = trocaOleo.km + trocaOleo.intervalo;
        const faltam = prox - kmAtual;
        const proxOleoEl = document.getElementById('proxOleo');
        const cardOleoEl = document.getElementById('cardOleo');
        if (proxOleoEl) proxOleoEl.textContent = faltam > 0 ? `${faltam} km` : 'VENCIDA';
        if (cardOleoEl) cardOleoEl.className = faltam <= 0 ? 'card alerta' : 'card';
    }
}

// ===== EXPORTAR CSV =====
function exportarCSV() {
    let csv = 'Data,Km,Litros,Valor/L,Total,Tipo,Media_km_L\n';
    abastecimentos.forEach((a, i) => {
        const anterior = abastecimentos[i-1];
        const kmRodado = anterior ? a.km - anterior.km : 0;
        const media = anterior && kmRodado > 0 ? (kmRodado / a.litros).toFixed(2) : '';
        csv += `${a.data},${a.km},${a.litros},${a.valorL},${a.total},${a.tipo},${media}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'abastecimentos.csv';
    link.click();
}

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
}

// ===== SAVE =====
function salvar() {
    localStorage.setItem('abastecimentos', JSON.stringify(abastecimentos));
    localStorage.setItem('manutencoes', JSON.stringify(manutencoes));
}
