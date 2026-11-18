# Gerenciador de Tarefas — Full Stack

Projeto adaptado do exemplo CRUD de Usuários para a entidade **Tarefa**.

## Tecnologias
- Frontend: HTML, CSS e JavaScript
- Backend: Node.js, Express e Mongoose
- Banco de dados: MongoDB (local ou Atlas)

## 1. Configurar o banco
Crie um cluster no MongoDB Atlas, crie um usuário de banco de dados e libere o IP de acesso (para teste, `0.0.0.0/0`). Copie a string de conexão e substitua usuário, senha e nome do banco.
No backend, crie/edite `backend/.env`:
`MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster...mongodb.net/gerenciador_tarefas?retryWrites=true&w=majority`
Não publique o arquivo `.env` nem compartilhe sua senha.

## 2. Rodar localmente
Terminal 1:
```bash
cd backend
npm install
npm run dev
```
A API fica em `http://localhost:3000`. Teste `http://localhost:3000/health`.
Terminal 2:
```bash
cd front
npx serve .
```
Abra a URL indicada pelo `serve`. O `front/config.js` aponta para `http://localhost:3000` por padrão.

## 3. CRUD da entidade Tarefa
| Método | Rota | Operação |
|---|---|---|
| GET | `/tarefas` | Listar todas |
| GET | `/tarefas/:id` | Buscar por ID |
| POST | `/tarefas` | Criar |
| PUT | `/tarefas/:id` | Atualizar |
| DELETE | `/tarefas/:id` | Excluir |

Campos: `titulo` (obrigatório), `descricao`, `status` (Pendente/Em andamento/Concluída), `prioridade` (Baixa/Média/Alta).

Exemplo POST:
```json
{"titulo":"Estudar Full Stack","descricao":"Finalizar atividade","status":"Pendente","prioridade":"Alta"}
```

## 4. Publicar backend no GitHub e Render
1. Crie um repositório GitHub para o backend e envie **o conteúdo da pasta backend**. Não envie `.env` nem `node_modules`.
2. No Render, crie um Web Service conectado ao repositório. Build: `npm install`; Start: `npm start`.
3. Em Environment, adicione `MONGODB_URI` com a string Atlas. O serviço usa a porta fornecida pelo Render.
4. Depois do deploy, teste `https://SUA-API.onrender.com/health` e `/`.

## 5. Publicar frontend no GitHub e Netlify
1. Crie outro repositório GitHub e envie **o conteúdo da pasta front**.
2. No arquivo `front/config.js`, troque `http://localhost:3000` pela URL HTTPS do backend Render, sem barra no final.
3. Faça commit/push dessa alteração.
4. No Netlify, importe o repositório. Publish directory: `.` (sem build command).
5. Abra o site publicado e teste cadastro, listagem, busca, edição e exclusão.

## Observações
- Configure a Network Access do Atlas para aceitar conexões do Render.
- CORS está habilitado no backend para permitir chamadas do frontend.
- Deploy e teste em nuvem dependem das contas e credenciais do aluno; não foram executados neste pacote.
