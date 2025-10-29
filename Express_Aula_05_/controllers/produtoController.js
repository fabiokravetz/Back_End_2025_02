/*
// Importação da models

Executar o arquivo produtoModel.js.
Pegar o que quer que tenha sido "exportado" (module.exports).
*/

const Produto = require('../models/produtoModel'); 

// Objeto que agrupa os controladores
const produtoController = {};

produtoController.listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.buscarTodos();
        res.render('produtos', { produtos: produtos });
    } catch (erro) {
        res.status(500).send('Erro ao buscar produtos: ' + erro.message);
    }
};

// --- CREATE ---
// Apresenta o formulário de adicionar produtos
produtoController.mostrarFormularioAdicionar = (req, res) => {
    res.render('adicionar_produto');
};

// CREATE: Adição de um produto novo
produtoController.adicionarProduto = async (req, res) => {
    try {
        // req.body contém os dados do formulário (nome, preco, categoria)
        await Produto.criar(req.body);
        res.redirect('/produtos'); // Redireciona para a lista após adicionar
    } catch (erro) {
        res.status(500).send('Erro ao adicionar produto: ' + erro.message);
    }
};

// --- UPDATE ---
// Apresenta o formulário de edição
produtoController.mostrarFormularioEditar = async (req, res) => {
    try {
        const id = req.params.id;
        const produto = await Produto.buscarPorId(id);
        if (produto) {
            res.render('editar_produto', { produto: produto });
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (erro) {
        res.status(500).send('Erro ao buscar produto: ' + erro.message);
    }
};

// UPDATE: Atualiza um produto
produtoController.atualizarProduto = async (req, res) => {
    try {
        const id = req.params.id;
        await Produto.atualizar(id, req.body);
        res.redirect('/produtos'); // Redireciona para a lista após atualizar
    } catch (erro) {
        res.status(500).send('Erro ao atualizar produto: ' + erro.message);
    }
};

// --- DELETE ---
// Deleta um produto
produtoController.deletarProduto = async (req, res) => {
    try {
        const id = req.params.id;
        await Produto.deletar(id);
        res.redirect('/produtos'); // Redireciona para a lista após deletar
    } catch (erro) {
        res.status(500).send('Erro ao deletar produto: ' + erro.message);
    }
};

module.exports = produtoController;