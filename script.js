// 1. Inicialização segura
let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
let veiculoAtual = veiculos.length > 0 ? veiculos[0].id : null;

function addVeiculo() {
    // Captura os valores
    const nome = document.getElementById("vNome").value;
    const ano = document.getElementById("vAnoModelo").value;
    const km = document.getElementById("vKmInicial").value;
    const data = document.getElementById("vDataAquisicao").value; // Verifique se o ID no HTML é este

    // Validação
    if (!nome) {
        alert("Por favor, preencha o nome do veículo.");
        return;
    }

    // Cria o objeto
    const novoVeiculo = {
        id: Date.now(),
        nome: nome,
        anoModelo: ano,
        kmInicial: km,
        dataAquisicao: data
    };

    // Salva no array e no Storage
    veiculos.push(novoVeiculo);
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
    
    // Feedback ao utilizador
    alert("Veículo salvo com sucesso!");
    
    // Limpa campos e recarrega a interface
    document.getElementById("vNome").value = "";
    document.getElementById("vAnoModelo").value = "";
    document.getElementById("vKmInicial").value = "";
    document.getElementById("vDataAquisicao").value = "";
    
    render(); // Atualiza a página sem precisar de F5
}

function render() {
    // Atualiza o select do topo
    const select = document.getElementById("selectVeiculo");
    if (select) {
        select.innerHTML = veiculos.map(v => 
            `<option value="${v.id}">${v.nome}</option>`
        ).join('');
    }

    // Atualiza a lista da aba Veículos
    const lista = document.getElementById("listaVeiculos");
    if (lista) {
        lista.innerHTML = veiculos.map(v => `
            <div class="item">
                <p><b>${v.nome}</b> (${v.anoModelo})</p>
                <button class="btn-del" onclick="excluirVeiculo(${v.id})">Excluir</button>
            </div>
        `).join('');
    }
}

// Inicializa ao carregar
window.onload = render;
