let itens = [];
let idEditando = null;
const listaCards = document.getElementById("listaCards");
const aviso = document.getElementById("semTarefas");

function salvarItensNoLocalStorage() {
    localStorage.setItem("listaDeTarefas", JSON.stringify(itens));
}

function carregarItensDoLocalStorage() {
    const itensSalvos = localStorage.getItem("listaDeTarefas");
    if (itensSalvos) {
        itens = JSON.parse(itensSalvos);
    } else {
        itens = [];
    }
}

document.addEventListener('DOMContentLoaded', function() {
    carregarItensDoLocalStorage();

    const formNovaTarefa = document.getElementById("formNovaTarefa");
    if (formNovaTarefa) {
        formNovaTarefa.addEventListener("submit", function(event) {
            event.preventDefault();
            salvarEvento();
        });
    }
    atualizarLista();
    atualizarTextoSemTarefas();
});

function salvarEvento() {
    const titulo = document.getElementById("tituloTarefa").value;
    const data = document.getElementById("dataTarefa").value;
    const comentario = document.getElementById("comentarioTarefa").value;
    const prioridade = document.getElementById("prioridadeTarefa").value;
    const notificacao = document.getElementById("notificacaoTarefa").checked;
    let dataCriacaoPersistence;

    const errorMessageElement = document.getElementById("modalErrorMessage");
    if (errorMessageElement) {
        errorMessageElement.textContent = "";
    }

    if (idEditando !== null) {
        const index = itens.findIndex(item => item.id === idEditando);
        if (index !== -1) {
            dataCriacaoPersistence = itens[index].dataCriacao;
            itens[index] = { id: idEditando, titulo, data, comentario, prioridade, notificacao, dataCriacao: dataCriacaoPersistence };
            const cardAntigo = document.getElementById("card" + idEditando);
            if (cardAntigo) {
                 cardAntigo.remove();
            }
        } else {
            console.error("Item para edição não encontrado com ID:", idEditando);
            dataCriacaoPersistence = Date.now();
            const id = itens.length ? (Math.max(...itens.map(i => i.id)) + 1) : 0;
            itens.push({ id, titulo, data, comentario, prioridade, notificacao, dataCriacao: dataCriacaoPersistence });
        }
        idEditando = null;
    } else {
        dataCriacaoPersistence = Date.now();
        const id = itens.length ? (Math.max(...itens.map(i => i.id), -1) + 1) : 0;
        itens.push({ id, titulo, data, comentario, prioridade, notificacao, dataCriacao: dataCriacaoPersistence });
    }

    salvarItensNoLocalStorage();
    atualizarLista();

    const modalElement = document.getElementById('exampleModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }

    limparForm();
    atualizarTextoSemTarefas();
}

function limparForm() {
    const formNovaTarefa = document.getElementById("formNovaTarefa");
    if (formNovaTarefa) {
        formNovaTarefa.reset();
    }
    document.getElementById("tituloTarefa").value = "";
    document.getElementById("dataTarefa").value = "";
    document.getElementById("comentarioTarefa").value = "";
    document.getElementById("prioridadeTarefa").selectedIndex = 0;
    document.getElementById("notificacaoTarefa").checked = false;

    const errorMessageElement = document.getElementById("modalErrorMessage");
    if (errorMessageElement) {
        errorMessageElement.textContent = "";
    }
    idEditando = null;
}

function deletarCard(id) {
    const cardParaDeletar = document.getElementById("card" + id);
    if (cardParaDeletar) {
        cardParaDeletar.remove();
    }
    itens = itens.filter(item => item.id !== id);
    salvarItensNoLocalStorage();
    atualizarTextoSemTarefas();
}

function editarCard(id) {
    const item = itens.find(item => item.id === id);
    if (item) {
        document.getElementById("tituloTarefa").value = item.titulo;
        document.getElementById("dataTarefa").value = item.data;
        document.getElementById("comentarioTarefa").value = item.comentario;
        document.getElementById("prioridadeTarefa").value = item.prioridade;
        document.getElementById("notificacaoTarefa").checked = item.notificacao;
        idEditando = id;

        const errorMessageElement = document.getElementById("modalErrorMessage");
        if (errorMessageElement) {
            errorMessageElement.textContent = "";
        }
    } else {
        console.error("Tentativa de editar item não encontrado:", id);
    }
}

function criarCard(item) {
    const card = document.createElement('div');
    card.className = 'card shadow m-2';
    card.id = "card" + item.id;
    card.style.width = '18rem';

    card.innerHTML = `
        <div class="card-body" onclick="detalhes(${item.id})" style="cursor: pointer;">
            <h5 class="card-title">${item.titulo}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Para: ${item.data}</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Prioridade: <span class="${item.prioridade}">${item.prioridade}</span></h6>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); expandir(${item.id})">Expandir</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation(); editarCard(${item.id});" data-bs-toggle="modal" data-bs-target="#exampleModal"><span class="material-icons">edit</span></button>
            <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deletarCard(${item.id})"><span class="material-icons">delete</span></button>
        </div>`;
    return card;
}

function atualizarLista() {
    listaCards.innerHTML = "";
    itens.forEach(item => {
        if (item) {
            listaCards.appendChild(criarCard(item));
        }
    });
}

function atualizarTextoSemTarefas() {
    if (itens.length === 0) {
        aviso.style.display = "flex";
    } else {
        aviso.style.display = "none";
    }
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
    const cardBody = document.querySelector(`#card${id} .card-body`);
    const item = itens.find(t => t.id === id);

    if (!cardBody || !item) return;

    let detalhes = cardBody.querySelector('.detalhes-expandido');

    if (detalhes) {
        detalhes.remove();
    } else {
        detalhes = document.createElement('div');
        detalhes.className = 'detalhes-expandido mt-2';
        detalhes.innerHTML = `
            <hr>
            <p><strong>Comentário:</strong> ${item.comentario || "Sem comentário."}</p>
            <p><strong>Data de criação:</strong> ${new Date(item.dataCriacao).toLocaleString()}</p>
        `;
        cardBody.appendChild(detalhes);
    }
}

function detalhes(id) {
    const item = itens.find(i => i.id === id);
    if (item) {
        localStorage.setItem("tarefaSelecionada", JSON.stringify(item));
        window.location.href = "detalhes.html";
    } else {
        console.error("Item não encontrado para detalhar:", id);
    }
}