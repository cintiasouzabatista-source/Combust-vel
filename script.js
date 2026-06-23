// ===== BANCO DE DADOS =====

let abastecimentos = JSON.parse(localStorage.getItem("abastecimentos")) || [];
let manutencoes = JSON.parse(localStorage.getItem("manutencoes")) || [];
let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [{id: Date.now(), nome: "Meu Veículo"}];
let veiculoAtual = localStorage.getItem("veiculoAtual") || veiculos[0].id;

function salvarVeiculo() {
    const nome = document.getElementById("vNome").value;
    if(!nome) return;
    veiculos.push({id: Date.now(), nome});
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
    renderVeiculos();
}

function mudarVeiculo() {
    veiculoAtual = document.getElementById("selectVeiculo").value;
    localStorage.setItem("veiculoAtual", veiculoAtual);
    location.reload(); // Recarrega para filtrar os dados do novo veículo
}

function resetarApp() {
    if(confirm("Deseja apagar todos os dados?")) {
        localStorage.clear();
        location.reload();
    }
}

// Ao renderizar listas (Abastecimentos/Manutencao), filtre:
// abastecimentos.filter(a => a.veiculoId == veiculoAtual)

// ===== INICIALIZAÇÃO =====

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("aData").valueAsDate = new Date();

    if (localStorage.getItem("tema") === "light") {
        document.body.classList.remove("dark");
        document.getElementById("theme-icon").className = "fas fa-sun";
    }

    trocarAba("painel");
    renderAbast();
    renderManut();
    atualizarPainel();
});

// ===== TEMA =====

function toggleTheme() {

    document.body.classList.toggle("dark");

    const icon = document.getElementById("theme-icon");

    if (document.body.classList.contains("dark")) {

        icon.className = "fas fa-moon";
        localStorage.setItem("tema", "dark");

    } else {

        icon.className = "fas fa-sun";
        localStorage.setItem("tema", "light");
    }
}

// ===== ABAS =====

function trocarAba(nome){

    // esconder todas as abas
    document.querySelectorAll(".aba").forEach(aba=>{
        aba.classList.remove("active");
    });

    // desativar todos os botões
    document.querySelectorAll(".tabs button").forEach(btn=>{
        btn.classList.remove("active");
    });

    // ativar a aba escolhida
    const aba = document.getElementById(nome);

    if(aba){
        aba.classList.add("active");
    }

    // ativar o botão correto
    document.querySelectorAll(".tabs button").forEach(btn=>{

        const onclick = btn.getAttribute("onclick");

        if(onclick && onclick.includes(nome)){
            btn.classList.add("active");
        }

    });
}

// ===== SALVAR ABASTECIMENTO =====

function addAbast() {

    const data = document.getElementById("aData").value;

    const km = Number(document.getElementById("aKm").value);

    const litros = Number(document.getElementById("aLitros").value);

    const valorL = Number(document.getElementById("aValorL").value);

    let total = Number(document.getElementById("aTotal").value);

    const tipo = document.getElementById("aTipo").value;

    if (!data || !km || !litros) {

        alert("Preencha os campos obrigatórios.");

        return;
    }

    if (!total) {

        total = litros * valorL;
    }

    abastecimentos.push({
        data,
        km,
        litros,
        valorL,
        total,
        tipo
    });

    abastecimentos.sort((a, b) => a.km - b.km);

    localStorage.setItem(
        "abastecimentos",
        JSON.stringify(abastecimentos)
    );

    document.getElementById("aKm").value = "";
    document.getElementById("aLitros").value = "";
    document.getElementById("aValorL").value = "";
    document.getElementById("aTotal").value = "";

    renderAbast();

    atualizarPainel();

    alert("Abastecimento salvo.");
}

// ===== SALVAR MANUTENÇÃO =====

function addManut() {
    const tipo = document.getElementById("mTipo").value;
    const km = Number(document.getElementById("mKm").value);
    const custo = Number(document.getElementById("mCusto").value);
    const obs = document.getElementById("mObs").value;

    if (!tipo || !km) {
        alert("Preencha o Tipo e a Quilometragem.");
        return;
    }

    manutencoes.push({ tipo, km, custo, obs });
    localStorage.setItem("manutencoes", JSON.stringify(manutencoes));
    
    // Limpar campos
    document.getElementById("mTipo").value = "";
    document.getElementById("mKm").value = "";
    document.getElementById("mCusto").value = "";
    document.getElementById("mObs").value = "";

    renderManut();
    atualizarPainel();
}

    if (!km) {

        alert("Informe a quilometragem.");

        return;
    }

    const [tipo, intervalo] = tipoInfo.split("|");

    manutencoes.push({

        tipo,

        intervalo: Number(intervalo),

        km,

        custo,

        obs
    });

    localStorage.setItem(
        "manutencoes",
        JSON.stringify(manutencoes)
    );

    document.getElementById("mKm").value = "";

    document.getElementById("mCusto").value = "";

    document.getElementById("mObs").value = "";

    renderManut();

    atualizarPainel();

    alert("Manutenção salva.");
}

// ===== LISTA ABASTECIMENTOS =====

function renderAbast() {

    const lista = document.getElementById("listaAbast");

    const ultimos = document.getElementById("ultimosAbast");

    lista.innerHTML = "";

    ultimos.innerHTML = "";

    const invertido = [...abastecimentos].reverse();

    invertido.forEach((item, indice) => {

        const html = `

        <div class="card">

            <strong>${item.data}</strong>

            <p>${item.tipo}</p>

            <p>${item.km} km</p>

            <p>${item.litros} L</p>

            <p>R$ ${item.total.toFixed(2)}</p>

            <button class="btn"

            onclick="removerAbast(${abastecimentos.length-1-indice})">

            Excluir

            </button>

        </div>

        `;

        lista.innerHTML += html;
    });

    invertido.slice(0,5).forEach(item=>{

        ultimos.innerHTML += `

        <p>

        ${item.data}

        - ${item.km} km

        - R$ ${item.total.toFixed(2)}

        </p>

        `;
    });
}

// ===== LISTA MANUTENÇÕES =====

function renderManut() {

    const lista = document.getElementById("listaManut");

    lista.innerHTML = "";

    [...manutencoes].reverse().forEach((item, indice)=>{

        lista.innerHTML += `

        <div class="card">

        <strong>${item.tipo}</strong>

        <p>${item.km} km</p>

        <p>R$ ${item.custo.toFixed(2)}</p>

        <p>${item.obs}</p>

        <button class="btn"

        onclick="removerManut(${manutencoes.length-1-indice})">

        Excluir

        </button>

        </div>

        `;
    });
}

// ===== REMOVER =====

function removerAbast(indice){

    abastecimentos.splice(indice,1);

    localStorage.setItem(
        "abastecimentos",
        JSON.stringify(abastecimentos)
    );

    renderAbast();

    atualizarPainel();
}

function removerManut(indice){

    manutencoes.splice(indice,1);

    localStorage.setItem(
        "manutencoes",
        JSON.stringify(manutencoes)
    );

    renderManut();

    atualizarPainel();
}

// ===== PAINEL =====

function atualizarPainel(){

    let total = 0;

    abastecimentos.forEach(a=>{

        total += a.total;
    });

    document.getElementById("totalGasto")
        .innerText = `R$ ${total.toFixed(2)}`;

    let kmAtual = 0;

    if(abastecimentos.length){

        kmAtual = Math.max(
            ...abastecimentos.map(a=>a.km)
        );
    }

    document.getElementById("kmAtual")
        .innerText = `${kmAtual} km`;

    let media = 0;

    if(abastecimentos.length >= 2){

        let distancia = 0;

        let litros = 0;

        for(let i=1;i<abastecimentos.length;i++){

            distancia += abastecimentos[i].km -
                         abastecimentos[i-1].km;
        }

        litros = abastecimentos
            .slice(1)
            .reduce((s,a)=>s+a.litros,0);

        if(litros){

            media = distancia/litros;
        }
    }

    document.getElementById("mediaGeral")
        .innerText = `${media.toFixed(1)} km/L`;

    atualizarOleo();
}

// ===== ÓLEO =====

function atualizarOleo(){

    const oleos = manutencoes.filter(
        m => m.tipo === "Óleo Motor"
    );

    if(!oleos.length){

        document.getElementById("proxOleo")
            .innerText = "-";

        return;
    }

    const ultimo = oleos.at(-1);

    const proximo = ultimo.km + ultimo.intervalo;

    document.getElementById("proxOleo")
        .innerText = `${proximo} km`;
}

// ===== EXPORTAR CSV =====

function exportarCSV(){

    let csv = "Data,KM,Litros,Tipo,Total\n";

    abastecimentos.forEach(a=>{

        csv += `${a.data},${a.km},${a.litros},${a.tipo},${a.total}\n`;

    });

    const blob = new Blob(
        [csv],
        {type:"text/csv"}
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "abastecimentos.csv";

    a.click();
}
