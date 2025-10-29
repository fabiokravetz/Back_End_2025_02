/*
    INSTALAR VIA TERMINAL VS CODE
    npm init -y
    npm install express --save
    npm install express ejs
    npm install mysql2
    npm install open
*/

const express = require('express');
const path = require('path');
const produtoRoutes = require('./routes/produtoRoutes'); // Importação das rotas

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

/*
O método $app.use(), neste contexto, associa o roteador 
(produtoRoutes) a um caminho base (/produtos).

"Para qualquer requisição que comece com o caminho /produtos, use o roteador definido em produtoRoutes."

Qualquer rota definida dentro de produtoRoutes será prefixada com /produtos

Rota Definida em produtoRoutes.js	 URL Completa na Aplicação	         Finalidade
/(GET)	                                    /produtos	                 Listar produtos
/adicionar (GET)	                    /produtos/adicionar	             Mostrar formulário
/editar/:id (POST)	                    /produtos/editar/5	             Atualizar produto
*/

app.use('/produtos', produtoRoutes); 

app.get('/', (req, res) => {
    res.redirect('/produtos');
});

app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Servidor da loja rodando em ${url}`);

    (async () => {
        try {
            const openModule = await import('open');
            await openModule.default(url);
        } catch (error) {
            console.error('Erro ao tentar abrir o navegador:', error);
        }
    })();
});

