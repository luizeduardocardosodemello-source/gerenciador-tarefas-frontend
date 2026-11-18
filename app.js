const API_URL = `${window.API_BASE_URL || "http://localhost:3000"}/tarefas`;
const formulario = document.querySelector("#form-tarefa");
const campoId = document.querySelector("#tarefa-id");
const campoTitulo = document.querySelector("#titulo");
const campoDescricao = document.querySelector("#descricao");
const campoStatus = document.querySelector("#status");
const campoPrioridade = document.querySelector("#prioridade");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const listaTarefas = document.querySelector("#lista-tarefas");
const mensagem = document.querySelector("#mensagem");
const formularioBusca = document.querySelector("#form-busca");
const campoBuscaId = document.querySelector("#busca-id");

async function requisitar(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);
  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.mensagem || "Não foi possível concluir a operação");
  }
  return resposta.status === 204 ? null : resposta.json();
}
function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}
function criarCartao(tarefa) {
  const cartao = document.createElement("article");
  cartao.className = "tarefa";
  const titulo = document.createElement("h3"); titulo.textContent = tarefa.titulo;
  const descricao = document.createElement("p"); descricao.textContent = `Descrição: ${tarefa.descricao || "Sem descrição"}`;
  const status = document.createElement("p"); status.textContent = `Status: ${tarefa.status}`;
  const prioridade = document.createElement("p"); prioridade.textContent = `Prioridade: ${tarefa.prioridade}`;
  const id = document.createElement("p"); id.textContent = `ID: ${tarefa._id}`;
  const acoes = document.createElement("div"); acoes.className = "acoes-tarefa";
  const editar = document.createElement("button"); editar.type = "button"; editar.textContent = "Editar";
  editar.addEventListener("click", () => carregarEdicao(tarefa._id));
  const excluir = document.createElement("button"); excluir.type = "button"; excluir.className = "perigo"; excluir.textContent = "Excluir";
  excluir.addEventListener("click", () => excluirTarefa(tarefa._id));
  acoes.append(editar, excluir); cartao.append(titulo, descricao, status, prioridade, id, acoes);
  return cartao;
}
function exibirTarefas(tarefas) {
  listaTarefas.innerHTML = "";
  tarefas.forEach(t => listaTarefas.appendChild(criarCartao(t)));
  mostrarMensagem(tarefas.length ? `${tarefas.length} tarefa(s) encontrada(s)` : "Nenhuma tarefa cadastrada");
}
async function listarTarefas() {
  try { mostrarMensagem("Carregando tarefas..."); exibirTarefas(await requisitar(API_URL)); }
  catch (e) { listaTarefas.innerHTML = ""; mostrarMensagem(e.message, true); }
}
async function carregarEdicao(id) {
  try {
    const t = await requisitar(`${API_URL}/${id}`);
    campoId.value = t._id; campoTitulo.value = t.titulo; campoDescricao.value = t.descricao;
    campoStatus.value = t.status; campoPrioridade.value = t.prioridade;
    tituloFormulario.textContent = "Editar tarefa"; botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.classList.remove("oculto"); campoTitulo.focus();
  } catch (e) { mostrarMensagem(e.message, true); }
}
async function salvarTarefa(evento) {
  evento.preventDefault();
  const dados = { titulo: campoTitulo.value.trim(), descricao: campoDescricao.value.trim(),
    status: campoStatus.value, prioridade: campoPrioridade.value };
  const id = campoId.value;
  try {
    await requisitar(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados)
    });
    limparFormulario(); await listarTarefas(); mostrarMensagem(id ? "Tarefa atualizada!" : "Tarefa cadastrada!");
  } catch (e) { mostrarMensagem(e.message, true); }
}
async function excluirTarefa(id) {
  if (!confirm("Deseja excluir esta tarefa?")) return;
  try { await requisitar(`${API_URL}/${id}`, { method: "DELETE" }); limparFormulario(); await listarTarefas(); mostrarMensagem("Tarefa excluída!"); }
  catch (e) { mostrarMensagem(e.message, true); }
}
function limparFormulario() {
  formulario.reset(); campoId.value = ""; tituloFormulario.textContent = "Nova tarefa";
  botaoSalvar.textContent = "Cadastrar"; botaoCancelar.classList.add("oculto");
}
formulario.addEventListener("submit", salvarTarefa);
botaoCancelar.addEventListener("click", limparFormulario);
document.querySelector("#botao-atualizar").addEventListener("click", listarTarefas);
document.querySelector("#botao-limpar-busca").addEventListener("click", () => { campoBuscaId.value = ""; listarTarefas(); });
formularioBusca.addEventListener("submit", async e => {
  e.preventDefault(); const id = campoBuscaId.value.trim();
  if (!id) return mostrarMensagem("Informe um ID para buscar", true);
  try { exibirTarefas([await requisitar(`${API_URL}/${id}`)]); }
  catch (err) { listaTarefas.innerHTML = ""; mostrarMensagem(err.message, true); }
});
listarTarefas();
