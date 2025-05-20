let itens = [];
let idEditando = null;
const listaCards = document.getElementById("listaCards");
const aviso = document.getElementById("semTarefas");

function salvarEvento() {
    const titulo = document.getElementById("tituloTarefa").value;
    const data = document.getElementById("dataTarefa").value;
    const comentario = document.getElementById("comentarioTarefa").value;
    const prioridade = document.getElementById("prioridadeTarefa").value;
    const notificacao = document.getElementById("notificacaoTarefa").checked;
    const dataCriacao = Date.now();

    if (idEditando !== null) {
        const index = itens.findIndex(item => item.id === idEditando);
        itens[index] = { id: idEditando, titulo, data, comentario, prioridade, notificacao, dataCriacao };
        document.getElementById("card" + idEditando).remove();
        idEditando = null;
    } else {
        const id = itens.length ? itens.at(-1).id + 1 : 0;
        itens.push({ id, titulo, data, comentario, prioridade, notificacao, dataCriacao });
    }

    atualizarLista();
    limparForm();
    atualizarTextoSemTarefas();
}

function limparForm() {
    document.getElementById("tituloTarefa").value = "";
    document.getElementById("dataTarefa").value = "";
    document.getElementById("comentarioTarefa").value = "";
    document.getElementById("prioridadeTarefa").selectedIndex = 0;
    document.getElementById("notificacaoTarefa").checked = false;
    idEditando = null;
}

function deletarCard(id) {
    document.getElementById("card" + id).remove();
    itens = itens.filter(item => item.id !== id);
    atualizarTextoSemTarefas();
}

function editarCard(id) {
    const item = itens.find(item => item.id === id);
    document.getElementById("tituloTarefa").value = item.titulo;
    document.getElementById("dataTarefa").value = item.data;
    document.getElementById("comentarioTarefa").value = item.comentario;
    document.getElementById("prioridadeTarefa").value = item.prioridade;
    document.getElementById("notificacaoTarefa").checked = item.notificacao;
    idEditando = id;
}

function expandir(id) {
    const item = itens.find(item => item.id === id);
    localStorage.setItem("tarefaSelecionada", JSON.stringify(item));
    window.location.href = "detalhes.html";
}

function criarCard(item) {
    const card = document.createElement('div');
    card.className = 'card shadow m-2';
    card.id = "card" + item.id;
    card.style.width = '18rem';
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${item.titulo}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Para: ${item.data}</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Prioridade: <span class="${item.prioridade}">${item.prioridade}</span></h6>
            <p class="card-text">${item.comentario}</p>
            <button class="btn btn-sm btn-outline-danger" onclick="deletarCard(${item.id})"><span class="material-icons">delete</span></button>
            <button class="btn btn-sm btn-outline-secondary" onclick="editarCard(${item.id})" data-bs-toggle="modal" data-bs-target="#exampleModal"><span class="material-icons">edit</span></button>
            <button class="btn btn-sm btn-outline-info" onclick="expandir(${item.id})">Detalhes</button>
        </div>`;
    return card;
}

function atualizarLista() {
    listaCards.innerHTML = "";
    itens.forEach(item => {
        listaCards.appendChild(criarCard(item));
    });
}

function atualizarTextoSemTarefas() {
    aviso.style.display = itens.length === 0 ? "block" : "none";
}

function ordenarTarefas(tipo) {
    switch (tipo) {
        case 'dataCriacao':
            itens.sort((a, b) => a.dataCriacao - b.dataCriacao);
            break;
        case 'dataTarefa':
            itens.sort((a, b) => a.data.localeCompare(b.data));
            break;
        case 'prioridade':
            const ordem = { Alta: 1, Média: 2, Baixa: 3 };
            itens.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
            break;
        case 'alfabetica':
            itens.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
    }
    atualizarLista();
}

function expandir(id) {
  const item = itens.find(i => i.id === id);
  localStorage.setItem("tarefaSelecionada", JSON.stringify(item));
  window.location.href = "detalhes.html";
}