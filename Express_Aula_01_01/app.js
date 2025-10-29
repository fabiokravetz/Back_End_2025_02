/*
    INSTALAR VIA TERMINAL VS CODE
    npm init -y
    npm install express --save
    npm install express ejs
    npm install open
*/

/*
path -> "Ferramenta" para trabalhar com caminhos de arquivos e diretórios.
*/
const express = require("express");
const path = require("path");
const app = express();
const port = 8081;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//-----------SIMULAÇÃO BANCO DE DADOS---------
const usuarios = [
    {id: 1, nome: "Juliana Silva", email: "ju.silva@gmail.com"},
    {id: 2, nome: "Bruno Souza", email: "bruno.souza@outlook.com"},
    {id: 3, nome: "Carla Fernandes", email: "carla.fer@yahoo.com"}
];

//------------------ROTAS-------------------
//Rota principal que irá renderizar a página
app.get('/', (req, res)=>{
    res.render('index', {usuarios: usuarios});
});

//SERVIDOR
/*
O código dentro de () => { ... }: É executado apenas uma vez, assim que o servidor está pronto.

Bloco (async () => { ... })(): Código que abre o seu navegador padrão automaticamente na página http://localhost:8081 .
*/
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

            // O código aqui SÓ executa DEPOIS que a importação acima terminar.

          // 2ª Pausa:
          // O await aqui diz: "PARE A EXECUÇÃO DESTA FUNÇÃO ASYNC NOVAMENTE
          // até que a função de abrir o navegador termine."
            await openModule.default(url);
        } catch (error) {
            console.error('Erro ao tentar abrir o navegador:', error);
        }
    })(); 
});

/*
Crie uma página de uma loja virtual onde deve ser apresentada
uma lista de produtos com seus respectivos preços.

Formate os valores dos produtos em reais por meio de uma função
*/