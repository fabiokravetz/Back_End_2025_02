const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Lista todos os produtos
router.get('/', produtoController.listarProdutos);

// Exibe o formulário para adicionar um produto novo
router.get('/adicionar', produtoController.mostrarFormularioAdicionar);

// Processa a adição de um produto novo
router.post('/adicionar', produtoController.adicionarProduto);

// Exibe o formulário de edição de um produto já existente
router.get('/editar/:id', produtoController.mostrarFormularioEditar);

// Processa a atualização de um produto já existente
router.post('/editar/:id', produtoController.atualizarProduto);

// Deleta um produto existente
router.get('/deletar/:id', produtoController.deletarProduto);

//Exporta o objeto router, permitindo que ele seja importado e usado pelo app.js.
module.exports = router;