/*
    INSTALAR VIA TERMINAL VS CODE
    npm init -y
    npm install express --save
    npm install express ejs
    npm install mysql2
    npm install puppeteer
    npm install axios
    npm install open
*/

const puppeteer = require("puppeteer");
const mysql = require("mysql2/promise");
const axios = require("axios");

async function scrap(){
    
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'fukuda',
        database: 'biblioteca'
    };

    let browser;
    let connection;

    /*
    puppeteer.launch({ headless: "new" }): Inicia uma instância do navegador.
    A opção headless: "new" faz com que o navegador rode em segundo plano,
    ou seja, sem interface gráfica visível.

    headless: false -> Abre o navegador (Interface gráfica visível)
    */

    try{
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();//Abre uma nova aba do navegador
        await page.goto("http://books.toscrape.com/");

        //Aguarda o elemento .product_pod ser carregado na página
        await page.waitForSelector('.product_pod');

        /*
        O código dentro da função abaixo não é executado no ambiente Node.js, 
        mas sim no console do navegador, ou seja, no contexto da página que foi
        carregada.
        */
        const resultado = await page.evaluate(() => {
            const dadosLivro = [];

            const elementos_livro = document.querySelectorAll('.product_pod');

            //Iteração sobre cada elemento do livro encontrado na página
            elementos_livro.forEach((elementoLivro) => {

                const titulo = elementoLivro.querySelector('h3 a').getAttribute('title');
                const preco = elementoLivro.querySelector('.price_color').innerText;
                const estoque = elementoLivro.querySelector('.instock.availability').innerText;

                //Monta um objeto com titulo, preco e estoque e adiciona ao array
                //dadosLivro
                dadosLivro.push({
                    titulo: titulo,
                    preco: preco,
                    estoque: estoque
                });
            });
            return dadosLivro;
        });

//-----------------BANCO DE DADOS e CONVERSÃO DE MOEDA (AXIOS)------------------

        //axios.get(...): Faz uma requisição HTTP para a API de cotações.
        //Base da URL: https://api.frankfurter.app/latest
        console.log("Buscando a cotação de câmbio de libra para real");
        const resposta_axios = await axios.get('https://api.frankfurter.app/latest?from=GBP&to=BRL');

        /*
        resposta_axios.data.rates.BRL: Axios retorno um objeto de resposta.
        resposta_axios.data é o corpo da resposta em formato JSON.
        Em rates.BRL pegamos o valor numérico da cotação.
        */

        const exchange_rate = resposta_axios.data.rates.BRL;
        console.log(`Cotação atual: 1 Libra = ${exchange_rate} BRL`);

        //Conexão com o banco de dados
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o BD estabelecida');

        for (const livro of resultado){
            //Extrai o valor numérico em libras
            const precoLibras = parseFloat(livro.preco.replace('£', ''));

            //Converte o valor para reais usando a cotação obtida acima.
            const precoReais = precoLibras * exchange_rate;

            const sql = 'INSERT INTO biblioteca.livros (titulo, preco, estoque) VALUES (?, ?, ?)';
            await connection.execute(sql, [livro.titulo, precoReais.toFixed(2), livro.estoque]);
        }

        const successMessage = `Sucesso ${resultado.length} livros foram inseridos no BD!`;
        console.log(successMessage);

        //A função evaluate recebe a mensagem e a executa dentro do navegador
        await page.evaluate((msg) => {
            alert(msg);
        }, successMessage);

    }catch(error){
        console.error("Ocorreu um erro!", error);
    } finally{
        if (connection){
            await connection.end();
            console.log("Conexão com o MySQL fechada");
        }
        if(browser){
            await browser.close();
            console.log("Navegador fechado!");
        }
    }
}
scrap();

/*
Criar uma aplicação simples com Express.js que, ao ser acessada, irá extrair as citações da 
primeira página do site http://quotes.toscrape.com/ e salvará essas citações em um arquivo PDF.
*/