// Pega o tbody da tabela onde as tarefas serão mostradas
const lista = document.getElementById('listaTarefas');
const form = document.getElementById('form-tarefa');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // previne reload da página
  adicionarTarefa();
});

function adicionarTarefa() {
  const tarefaInput = document.getElementById('tarefa');
  const horarioInput = document.getElementById('horario');

  const tarefa = tarefaInput.value.trim();
  const horario = horarioInput.value;

  if (!tarefa || !horario) {
    alert("Por favor, preencha a tarefa e o horário.");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    nome: tarefa,
    horario: horario,
    status: 'Pendente'
  };

  const tarefas = carregarTarefas();
  tarefas.push(novaTarefa);
  salvarTarefas(tarefas);

  renderizarTarefas();

  tarefaInput.value = '';
  horarioInput.value = '';
}

function formatarDataHora(dataHora) {
  const data = new Date(dataHora);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

function salvarTarefas(tarefas) {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
  const tarefasSalvas = localStorage.getItem('tarefas');
  return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
}

function excluirTarefa(id) {
  const tarefas = carregarTarefas().filter(tarefa => tarefa.id !== id);
  salvarTarefas(tarefas);
  renderizarTarefas();
}

function concluirTarefa(id) {
  const tarefas = carregarTarefas().map(tarefa => {
    if (tarefa.id === id) {
      tarefa.status = 'Concluída';
    }
    return tarefa;
  });
  salvarTarefas(tarefas);
  renderizarTarefas();
}

function renderizarTarefas() {
  lista.innerHTML = '';

  const tarefas = carregarTarefas();

  tarefas.forEach(tarefa => {
    const linha = document.createElement('tr');

    const tdTarefa = document.createElement('td');
    tdTarefa.textContent = tarefa.nome;

    const tdHorario = document.createElement('td');
    tdHorario.textContent = formatarDataHora(tarefa.horario);

    const tdStatus = document.createElement('td');
    tdStatus.textContent = tarefa.status;
    tdStatus.classList.add(
      tarefa.status === 'Concluída' ? 'status-concluida' : 'status-pendente'
    );

    const tdAcoes = document.createElement('td');

    const btnConcluir = document.createElement('button');
    btnConcluir.textContent = '✅';
    btnConcluir.classList.add('acao-btn', 'acao-concluir');
    btnConcluir.disabled = tarefa.status === 'Concluída';
    btnConcluir.onclick = () => concluirTarefa(tarefa.id);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = '❌';
    btnExcluir.classList.add('acao-btn', 'acao-excluir');
    btnExcluir.onclick = () => excluirTarefa(tarefa.id);

    tdAcoes.appendChild(btnConcluir);
    tdAcoes.appendChild(btnExcluir);

    linha.appendChild(tdTarefa);
    linha.appendChild(tdHorario);
    linha.appendChild(tdStatus);
    linha.appendChild(tdAcoes);

    lista.appendChild(linha);
  });
}

// Inicializa quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', renderizarTarefas);
