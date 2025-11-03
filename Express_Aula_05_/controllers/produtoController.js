const Produto = require('../models/produtoModel'); // Importação da models

const produtoController = {}; // Objeto que agrupa os controladores

/*
 Objeto 'produtoController' fica neste formato:

 produtoController = {
  listarProdutos: [função async],
  mostrarFormularioAdicionar: [função async],
  adicionarProduto: [função async],
  mostrarFormularioEditar: [função async],
  atualizarProduto: [função async],
  deletarProduto: [função async]
}
*/

produtoController.listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.buscarTodos();
        res.render('produtos', { produtos: produtos });
    } catch (erro) {
        res.status(500).send('Erro ao buscar produtos: ' + erro.message);
    }
};

//------------------Formulário de adicionar produtos------------------------
produtoController.mostrarFormularioAdicionar = (req, res) => {
    res.render('adicionar_produto');
};

//-------------------------------CREATE--------------------------------------
produtoController.adicionarProduto = async (req, res) => {
    try {
        await Produto.criar(req.body);
        res.redirect('/produtos'); 
    } catch (erro) {
        res.status(500).send('Erro ao adicionar produto: ' + erro.message);
    }
};

//-------------------------formulário de edição------------------------------
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

//---------------------------------UPDATE-------------------------------------
produtoController.atualizarProduto = async (req, res) => {
    try {
        const id = req.params.id;
        await Produto.atualizar(id, req.body);
        res.redirect('/produtos');
    } catch (erro) {
        res.status(500).send('Erro ao atualizar produto: ' + erro.message);
    }
};

//---------------------------------DELETE-------------------------------------
produtoController.deletarProduto = async (req, res) => {
    try {
        const id = req.params.id;
        await Produto.deletar(id);
        res.redirect('/produtos'); 
    } catch (erro) {
        res.status(500).send('Erro ao deletar produto: ' + erro.message);
    }
};

module.exports = produtoController;