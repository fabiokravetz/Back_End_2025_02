/*
    INSTALAR VIA TERMINAL VS CODE
    npm init -y
    npm install express --save
    npm install express ejs
    npm install open
*/

//Importação do Express
/*
require("express") é a forma como o Node.js importa módulos (ou bibliotecas e pacotes)
*/
const express = require("express");

//Intância do express
const app = express();

/*
O método GET é usado quando um cliente (como um navegador) quer obter dados de um servidor.

"/" - Este é o primeiro argumento do método .get(). Ele define qual caminho (URL) essa lógica vai atender. A "/" representa a rota raiz do site.

function(req, res){ ... } - Esta é a função de callback. É o "o que fazer" quando o evento (um pedido GET para a rota /) acontece. Essa função não é executada quando o servidor liga, mas sim toda vez que um usuário acessa essa rota específica.

req (Request / Requisição): Objeto que contém as infos sobre a requisição
que chegou ao cliente

res (Response / Resposta): Objeto que representa a resposta que o servidor
vai enviar para o cliente.

res.send() instrui o servidor a enviar uma resposta.
*/
app.get("/", function(req, res){
    res.send("<h1>Minha primeira aplicação com Express!</h1>")
})

/*
Método listen diz a aplicação para começar a "escutar" por 
requisições HTTP da rede
*/
app.listen(8081, function(){
    console.log("Servidor está funcionando!")
})

