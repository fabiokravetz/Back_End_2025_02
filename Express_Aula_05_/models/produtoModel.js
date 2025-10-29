const pool = require('../config/db'); // Importa o pool de conexão

// Criação de objeto que agrupa as funções do modelo
const Produto = {};

Produto.buscarTodos = async () => {
    const [linhas] = await pool.query('SELECT * FROM farmacia.produtos');
    return linhas;
};

/*
 No final o objeto 'Produto' fica neste formato:

 Produto = {
  buscarTodos: [função async],
  buscarPorId: [função async],
  criar: [função async],
  atualizar: [função async],
  deletar: [função async]
}
*/

Produto.buscarPorId = async (id) => {
    const [linhas] = await pool.query('SELECT * FROM farmacia.produtos WHERE id = ?', [id]);
    return linhas[0]; 
};


Produto.criar = async (produto) => {
    const { nome, preco, categoria } = produto;
    const [resultado] = await pool.query(
        'INSERT INTO farmacia.produtos (nome, preco, categoria) VALUES (?, ?, ?)',
        [nome, preco, categoria]
    );
    return resultado.insertId;
};


Produto.atualizar = async (id, produto) => {
    const { nome, preco, categoria } = produto;
    const [resultado] = await pool.query(
        'UPDATE farmacia.produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?',
        [nome, preco, categoria, id]
    );
    return resultado.affectedRows > 0; // Retorna true se alguma linha foi atualizada
};


Produto.deletar = async (id) => {
    const [resultado] = await pool.query('DELETE FROM farmacia.produtos WHERE id = ?', [id]);
    return resultado.affectedRows > 0; // Retorna true se alguma linha foi deletada
};

// A linha abaixo exporta o objeto Produto inteiro para fora do arquivo produtoModel.js
module.exports = Produto;