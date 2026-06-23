let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
let abastecimentos = JSON.parse(localStorage.getItem("abastecimentos")) || [];
let manutencoes = JSON.parse(localStorage.getItem("manutencoes")) || [];
let veiculoAtual = veiculos.length > 0 ? veiculos[0].id : null;

function addVeiculo() {
    veiculos.push({ id: Date.now(), nome: document.getElementById("vNome").value });
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
    render();
}

function addAbast() {
    abastecimentos.push({ vId: veiculoAtual, data: document.getElementById("aData").value, total: document.getElementById("aTotal").value });
    localStorage.setItem("abastecimentos", JSON.stringify(abastecimentos));
    render();
}

function addManut() {
    manutencoes.push({ vId: veiculoAtual, tipo: document.getElementById("mTipo").value });
    localStorage.setItem("manutencoes", JSON.stringify(manutencoes));
    render();
}

function render() {
    const select = document.getElementById("selectVeiculo");
    select.innerHTML = veiculos.map(v => `<option value="${v.id}">${v.nome}</option>`).join('');
    
    const abast = abastecimentos.filter(a => a.vId == veiculoAtual);
    document.getElementById("totalGasto").innerText = "R$ " + abast.reduce((s, a) => s + Number(a.total), 0).toFixed(2);
    
    document.getElementById("listaPainel").innerHTML = abast.map(a => `<div class="item"><span>${a.data}</span><span>R$ ${a.total}</span></div>`).join('');
    document.getElementById("listaVeiculos").innerHTML = veiculos.map(v => `<div class="item">${v.nome}</div>`).join('');
}

function trocarAba(id) {
    document.querySelectorAll('.aba').forEach(a => a.style.display = a.id === id ? 'block' : 'none');
}

function resetarApp() { localStorage.clear(); location.reload(); }
function toggleTheme() { document.body.classList.toggle('light'); }

window.onload = () => { render(); trocarAba('painel'); };
