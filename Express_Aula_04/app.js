/*
    INSTALAR VIA TERMINAL VS CODE
    npm init -y
    npm install express --save
    npm install mysql2
    npm install open
*/

/*
PASSO 1 - CRIAR SCHEMA E TABELA NO MYSQL

CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;
CREATE TABLE IF NOT EXISTS livrosapi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(100),
  ano_publicacao INT
);

PASSO 2:
---Inserir dados no BD para exemplificar via POSTMAN

INSERT INTO livrosapi (titulo, autor, ano_publicacao) VALUES 
('O Senhor dos Anéis', 'J.R.R. Tolkien', 1954);
*/

const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root',
  password: 'fukuda',
  database: 'biblioteca'
});

/*
app.use(...): Função que executa antes do seu código de rota. Ele pode modificar a requisição (req) ou a resposta (res).

express.json(): Sua função é verificar se a requisição que chega (como um POST ou PUT) tem um corpo (body) no formato JSON. Se tiver, ele automaticamente converte esse texto JSON em um objeto JavaScript e o disponibiliza em req.body.

************Sem esta linha, req.body nas suas rotas POST e PUT seria undefined.**************
*/

app.use(express.json());

//---------------ROTA GET - (Listar todos)------------------

app.get('/livros', async (req, res) => {
  try {

    /*
    A biblioteca mysql2/promise, por padrão, sempre retorna um array com dois elementos:

    Por exemplo: [ resultados , metadados ]

    await pool.query(...) vai nos dar um array como [ [dados_dos_livros], [infos_dos_campos] ]

    const [rows]: "Crie uma nova variável chamada rows e coloque nela o primeiro elemento (posição 0) do array que o await retornou."
    */

    const [rows] = await pool.query('SELECT * FROM livrosapi');

    //.json(rows):Converte o array rows (de objetos JavaScript) em uma string JSON e a envia como corpo da resposta.

    res.status(200).json(rows);//Envia a resposta.
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

//------------------ROTA GET - (Listar Um)------------------

app.get('/livros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM livrosapi WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

//-----------------ROTA POST - (Criar um Livro)----------------

/*
if (!titulo) { ... }: Se o titulo não foi enviado, 
retorna um erro 400 (Requisição Inválida).

status(201): Código HTTP 201 Created. É o código semanticamente correto para 
um POST que cria um novo recurso.

const [result] = ...: Para um INSERT, o result não contém os dados, mas sim 
metadados sobre a operação, como result.insertId (o ID do livro que acabou de ser criado).
*/

app.post('/livros', async (req, res) => {
  const { titulo, autor, ano_publicacao } = req.body;
  if (!titulo) {
    return res.status(400).json({ message: 'O título é obrigatório' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO livrosapi (titulo, autor, ano_publicacao) VALUES (?, ?, ?)',
      [titulo, autor, ano_publicacao]
    );
    // Retorno objeto (boa prática)
    // O insertId é a propriedade, fornecida pela biblioteca mysql2, que armazena 
    // o ID recém-criado
    const novoLivro = { id: result.insertId, titulo, autor, ano_publicacao };
    res.status(201).json(novoLivro);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

//--------------ROTA PUT - (Atualizar um Livro)---------------
/*
const { id } = req.params;: Pega o ID da URL (qual livro atualizar).
const { ... } = req.body;: Pega os novos dados do corpo da requisição.
*/

app.put('/livros/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano_publicacao } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE livrosapi SET titulo = ?, autor = ?, ano_publicacao = ? WHERE id = ?',
      [titulo, autor, ano_publicacao, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.status(200).json({ id: id, titulo, autor, ano_publicacao });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

//--------------ROTA DELETE - (Deletar um Livro)---------------

app.delete('/livros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM livrosapi WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    //Código HTTP 204 - (Sem Conteúdo).
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

/*
Exercício 01 - Requisitos:
- Criar uma nova API;

- Conectar-se ao novo banco de dados onde o schema é chamado loja e se tem uma tabela chamada produtos.

- Implementar 5 endpoints (GET all, GET one, POST, PUT, DELETE) para a rota /produtos.

- O endpoint POST deve receber nome e preco. O estoque é opcional (se não for enviado, deve ser 0).

- O endpoint PUT deve ser capaz de atualizar nome, preco e estoque.

- Fazer validações: nome é obrigatório e o preco deve ser um valor positivo.
*/

