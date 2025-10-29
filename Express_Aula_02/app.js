/*
    INSTALAR VIA TERMINAL VS CODE
    npm init -y
    npm install express --save
    npm install express ejs
    npm install mysql2
    npm install open
*/

const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

//"Traduz" os dados enviados via formulário para um
//objeto JavaScript
app.use(express.urlencoded({extended: true}));
//app.use(express.json())

app.set('view engine', 'ejs');
app.use(express.static('public'));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'fukuda',
    database: 'crud_express_mysql'
});
console.log('Pool de conexões com MySQL criado com sucesso!');

//---------------------ROTAS DA APLICAÇÃO--------------------

//-----------------------ROTA SELECT-------------------------
app.get('/', (req, res) =>{
    const sql = 'SELECT * FROM produtos';
    pool.query(sql, (erro, dadosTabela) =>{
        if(erro){
            console.log('Erro na query SELECT: ', erro);
            return res.status(500).send('Erro ao buscar dados');
        }
        res.render('produtos', {produtos : dadosTabela});
    });
});

//-------------------------ROTA CREATE-------------------------------

//req.body é o objeto que contém os dados enviados pelo formulário.
//app.use(express.urlencoded(...)) "traduzem" os dados do formulário
//para um objeto JavaScript e preenche o req.body

app.post('/adicionar', (req, res) => {
    const {nome, preco, descricao} = req.body;
    const sql = 'INSERT INTO produtos (nome, preco, descricao) VALUES (?, ?, ?)';
    pool.query(sql, [nome, preco, descricao], (erro, resultado) => {
        if(erro){
            console.log('Erro na query INSERT: ', erro);
            return res.status(500).send('Erro ao adicionar dados');
        }
        console.log('Produto adicionado com sucesso!');
        res.redirect('/');
    });
});

//-----------------ROTA PARA EXIBIÇÃO DO FORMULÁRIO - UPDATE----------------
app.get('/editar/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM produtos WHERE id = ?';
    pool.query(sql, [id], (erro, dadosTabela) => {
        if(erro){
            console.log('Erro na query SELECT por ID: ', erro);
            return res.status(500).send('Erro ao buscar dados para edição');
        }
        if(dadosTabela.length === 0){
            return res.status(404).send('Produto não encontrado!');
        }
        res.render('edit_produtos', {produto : dadosTabela[0]})
    });
});

//-------------------ROTA PARA ATUALIZAR PRODUTO - UPDATE--------------------------

//O objeto req.params contém os parâmetros da rota.
//Neste caso, req.params será { id: '1' } se a URL
//for /atualizar/1

app.post('/atualizar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;
    const sql = 'UPDATE produtos SET nome = ?, preco = ?, descricao = ? WHERE id = ?';
    pool.query(sql, [nome, preco, descricao, id], (erro, resultado) => {
        if(erro){
            console.log('Erro na query UPDATE: ', erro);
            return res.status(500).send('Erro ao tentar atualizar os dados');
        }
        console.log('Produto atualizado com sucesso!');
        res.redirect('/');
    });
});
//---------------------ROTA PARA DELETAR UM PRODUTO - DELETE------------------------

app.post('/deletar/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produtos WHERE id = ?';
    pool.query(sql, [id], (erro, resultado) => {
        if (erro) {
            console.error('Erro na query DELETE:', erro);
            return res.status(500).send('Erro ao deletar um produto.');
        }
        console.log('Produto deletado com sucesso!');
        res.redirect('/');
    });
});

app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Servidor rodando em http://localhost:${port}`);

    (async () => {
        try {
            //O await pausa a execução SOMENTE DENTRO da função async específica.
            // 1ª Pausa:
    	    // O await aqui diz: "PARE A EXECUÇÃO DESTA FUNÇÃO ASYNC
            // até que 'import('open')' seja finalizado (carregado)."
            const openModule = await import('open');

          // 2ª Pausa:
          // O await aqui diz: "PARE A EXECUÇÃO DESTA FUNÇÃO ASYNC NOVAMENTE
          // até que a função de abrir o navegador termine."
            await openModule.default(url);
        } catch (error) {
            console.error('Erro ao tentar abrir o navegador:', error);
        }
    })(); 
});