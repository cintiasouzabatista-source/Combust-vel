let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [{id: 1, nome: "Carro Principal"}];
let veiculoAtual = localStorage.getItem("veiculoAtual") || 1;
let abastecimentos = JSON.parse(localStorage.getItem("abastecimentos")) || [];
let manutencoes = JSON.parse(localStorage.getItem("manutencoes")) || [];

function render() {
    // Select de Veículos
    const select = document.getElementById("selectVeiculo");
    select.innerHTML = veiculos.map(v => `<option value="${v.id}" ${v.id == veiculoAtual ? 'selected' : ''}>${v.nome}</option>`).join('');

    // Filtra dados do veículo
    const abastFiltrados = abastecimentos.filter(a => a.vId == veiculoAtual);
    const manutFiltradas = manutencoes.filter(m => m.vId == veiculoAtual);

    // Renderiza Abastecimentos
    document.getElementById("listaAbast").innerHTML = abastFiltrados.map((a, i) => `
        <div class="item">
            <p><b>${a.data}</b> - ${a.km}km - R$${a.total}</p>
            <button class="btn-del" onclick="excluir('abastecimentos', ${abastecimentos.indexOf(a)})">X</button>
        </div>`).join('');

    // Renderiza Manutencao
    document.getElementById("listaManut").innerHTML = manutFiltradas.map((m, i) => `
        <div class="item">
            <p><b>${m.tipo}</b> - ${m.km}km - R$${m.custo}</p>
            <button class="btn-del" onclick="excluir('manutencoes', ${manutencoes.indexOf(m)})">X</button>
        </div>`).join('');
}

function addAbast() {
    abastecimentos.push({vId: veiculoAtual, data: document.getElementById("aData").value, km: document.getElementById("aKm").value, total: document.getElementById("aTotal").value});
    localStorage.setItem("abastecimentos", JSON.stringify(abastecimentos));
    render();
}

function addManut() {
    manutencoes.push({vId: veiculoAtual, tipo: document.getElementById("mTipo").value, km: document.getElementById("mKm").value, custo: document.getElementById("mCusto").value});
    localStorage.setItem("manutencoes", JSON.stringify(manutencoes));
    render();
}

function addVeiculo() {
    const nome = document.getElementById("vNome").value;
    const anoModelo = document.getElementById("vAnoModelo").value;
    const kmInicial = document.getElementById("vKmInicial").value;
    const dataAquisicao = document.getElementById("vDataAquisição").value;

    if (!nome) {
        alert("O nome do veículo é obrigatório.");
        return;
    }

    const novoVeiculo = {
        id: Date.now(),
        nome,
        anoModelo,
        kmInicial,
        dataAquisicao
    };

    veiculos.push(novoVeiculo);
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
    
    // Limpar campos
    document.getElementById("vNome").value = "";
    document.getElementById("vAnoModelo").value = "";
    document.getElementById("vKmInicial").value = "";
    document.getElementById("vDataAquisição").value = "";

    location.reload(); // Recarrega para atualizar o select
}
function mudarVeiculo() {
    localStorage.setItem("veiculoAtual", document.getElementById("selectVeiculo").value);
    location.reload();
}

function excluir(tipo, index) {
    if(confirm("Excluir item?")) {
        if(tipo === 'abastecimentos') abastecimentos.splice(index, 1);
        else manutencoes.splice(index, 1);
        localStorage.setItem(tipo, JSON.stringify(tipo === 'abastecimentos' ? abastecimentos : manutencoes));
        render();
    }
}
// Adicione esta função ao seu script.js
function renderVeiculos() {
    const container = document.getElementById("listaVeiculos");
    if (!container) return; // Se não estiver na aba de veículos, ignora

    container.innerHTML = veiculos.map(v => `
        <div class="item">
            <div>
                <strong>${v.nome}</strong><br>
                <small>${v.anoModelo || 'Sem ano'} | Km Inicial: ${v.kmInicial || 0}</small>
            </div>
            <button class="btn-del" onclick="excluirVeiculo(${v.id})">Excluir</button>
        </div>
    `).join('');
}
// Adicione esta função ao seu script.js
function renderVeiculos() {
    const container = document.getElementById("listaVeiculos");
    if (!container) return; // Se não estiver na aba de veículos, ignora

    container.innerHTML = veiculos.map(v => `
        <div class="item">
            <div>
                <strong>${v.nome}</strong><br>
                <small>${v.anoModelo || 'Sem ano'} | Km Inicial: ${v.kmInicial || 0}</small>
            </div>
            <button class="btn-del" onclick="excluirVeiculo(${v.id})">Excluir</button>
        </div>
    `).join('');
}

function excluirVeiculo(id) {
    if (veiculos.length === 1) {
        alert("Você precisa de pelo menos um veículo cadastrado.");
        return;
    }
    veiculos = veiculos.filter(v => v.id !== id);
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
    location.reload(); // Recarrega para limpar seletores
}

// IMPORTANTE: Adicione a chamada dentro do seu render() existente:
function render() {
    // ... seu código de renderização anterior ...
    renderVeiculos(); 
}
function excluirVeiculo(id) {
    if (veiculos.length === 1) {
        alert("Você precisa de pelo menos um veículo cadastrado.");
        return;
    }
    veiculos = veiculos.filter(v => v.id !== id);
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
    location.reload(); // Recarrega para limpar seletores
}

// IMPORTANTE: Adicione a chamada dentro do seu render() existente:
function render() {
    // ... seu código de renderização anterior ...
    renderVeiculos(); 
}
function resetarApp() {
    if(confirm("Deseja apagar TUDO?")) { localStorage.clear(); location.reload(); }
}

function trocarAba(id) {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function toggleTheme() { document.body.classList.toggle("light"); }

render();
