/*

Autenticação (Quem é você?): Tela de Login (usuário + senha).

Autorização (O que você pode fazer?): O processo de verificar se um usuário autenticado 
tem permissão para acessar um recurso específico.

-------------------------------------------------------------------------------
Sessões:

- O usuário faz login com sucesso.

- O Servidor (Express) cria uma Sessão única para esse usuário (armazenada na 
  memória do servidor).

- O Servidor envia um Cookie para o navegador do usuário contendo apenas o ID dessa sessão.

- Em todas as requisições futuras, o navegador envia o cookie de volta.

- O Servidor usa o ID do cookie para "procurar" os dados da sessão (req.session.user) e 
  identificar quem está fazendo a requisição.

-------------------------------------------------------------------------------

INSERIR ESSE CÓDIGO NO BD - Coluna criação inserida automaticamente no BD

Coluna "criacao" omitida comando INSERT, o MySQL ativa a regra DEFAULT CURRENT_TIMESTAMP 
definida pelo desenvolvedor com a data e hora em que a consulta foi executada.

CREATE DATABASE IF NOT EXISTS aula_login_express;
USE aula_login_express;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    usuario_id INT, // Chave estrangeira
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);
*/

const express = require('express');
const session = require('express-session');//gerenciamento de sessões
const bcrypt = require('bcrypt');
const pool = require('./bd'); 

const app = express();
const port = 3000;
/*
fatorHashSenha: Define a "complexidade" do hash do bcrypt. 
*/
const fatorHashSenha = 10; //Quando maior o valor mais demorado é o processo de hashing - Maior segurança


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//------------------------------Configuração de uma Session no Express------------------------------
app.use(session({
    secret: 'Teste1234@#', // Chave para criptografar o cookie
    resave: false, // Não salvar a sessão se não for modificada
    saveUninitialized: false, // Não cria sessão até algo ser armazenado
    cookie: { 
        secure: false, // Em ambientes de produção, use true (https)
        httpOnly: true, // Impede acesso via JS no cliente
        maxAge: 1000 * 60 * 60 // 1 hora de validade
    } 
}));

//------------------------------------------Autorização----------------------------------------------
/*
(autenticacaoLogin) verifica se o usuário está logado antes de acessar rotas protegidas

função next() passa a requisição para a próxima etapa (A lógica da rota protegida).
*/
function autenticacaoLogin(req, res, next) {
    if (req.session.userId) { // Se req.session.userId existe, o usuário está autenticado
        next();
    } else {
        res.redirect('/login');
    }
}

// ---------------------------------------ROTAS sem Login--------------------------------------------

//----------------------------------------Rota Principal---------------------------------------------
app.get('/', (req, res) => {
    res.render('index', { userId: req.session.userId });// Passa o ID do usuário da sessão para a view
});

//------------------------------Rota para mostrar formulário de registro-----------------------------
app.get('/registro', (req, res) => {
    res.render('registro');
});

//------------------------------------Rota para processar o registro---------------------------------
app.post('/registro', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).send("Por favor, preencha todos os campos.");
    }

    try {
    //-----------------------------------Usuário já foi cadastrado?-----------------------------------
        const [existeUsuarios] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existeUsuarios.length > 0) {
            return res.status(409).send("Email ou nome de usuário já cadastrado.");
        }
        //-----------------------------------Criptografa a senha--------------------------------------
        const passwordHash = await bcrypt.hash(password, fatorHashSenha);

        //---------------------------------Inserção - Novo usuário------------------------------------
        await pool.query(
            'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
            [email, username, passwordHash]
        );

        console.log("Usuário registrado com sucesso:", username);
        res.redirect('/login');

    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).send("Erro ao registrar usuário.");
    }
});

//--------------------------------Apresenta formulário de login---------------------------------
app.get('/login', (req, res) => {
    res.render('login');
});

//--------------------------------Processamento login - (Acesso)--------------------------------
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Usuário e senha são obrigatórios!");
    }

    try {
        //--------------------------------Busca usuário no BD---------------------------------
        const [usuarios] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (usuarios.length === 0) {
            return res.status(401).send("Usuário ou senha inválidos.");
        }

        const usuario = usuarios[0];

        //----------------------------Senha enviada x hash salvo no BD-------------------------
        const verificaSenha = await bcrypt.compare(password, usuario.password_hash);

        if (verificaSenha) {//Se verdadeiro cria a sessão (Armazena ID do usuário)
            req.session.userId = usuario.id;
            req.session.username = usuario.username;
            
            console.log("Login ok, sessão criada para:", usuario.username);
            res.redirect('/paginaProtegida');
        } else {
            res.status(401).send("Usuário ou senha inválidos.");
        }
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).send("Erro interno no servidor.");
    }
});

//-------------------------------------------Logout--------------------------------------------
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Não foi possível fazer logout.");
        }
        res.clearCookie('connect.sid'); // 'connect.sid' - o nome padrão do cookie
        res.redirect('/');
    });
});

//-----------------------------ROTAS PROTEGIDAS - LOGIN NECESSÁRIO------------------------------
/*
Caso autenticacaoLogin chame next(), a função final é executada, renderizando o paginaProtegida.ejs 
com o nome de usuário salvo na sessão.
*/
app.get('/paginaProtegida', autenticacaoLogin, async (req, res) => {
    try {
        //--------------------------------Busca os dados no BD---------------------------------- 
        const [items] = await pool.query(
            'SELECT id, nome, descricao, criacao FROM items WHERE usuario_id = ? ORDER BY criacao DESC',
            [req.session.userId] 
        );
        res.render('paginaProtegida', { 
            username: req.session.username,
            items: items 
        });
    } catch (error) {
        console.error("Erro ao buscar itens:", error);
        res.status(500).send("Erro ao carregar a página.");
    }
});

//-------------------------------Inserção de dados - Tabela items----------------------------
app.post('/paginaProtegida/inserir', autenticacaoLogin, async (req, res) => {
    const { nome, descricao } = req.body;
    const usuario_id = req.session.userId;

    if (!nome) {
        return res.status(400).send("O nome do item é obrigatório.");
    }
    
    try {
        await pool.query(
            'INSERT INTO items (nome, descricao, usuario_id) VALUES (?, ?, ?)',
            [nome, descricao, usuario_id]
        );
        
        console.log(`Item '${nome}' inserido por: ${req.session.username}`);
        res.redirect('/paginaProtegida'); 
        
    } catch (error) {
        console.error("Erro ao inserir item:", error);
        res.status(500).send("Erro ao inserir o novo item.");
    }
});

app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Servidor rodando em ${url}`);
    (async () => {
        try {
            const openModule = await import('open');
            await openModule.default(url);
        } catch (error) {
            console.error('Erro ao tentar abrir o navegador:', error);
        }
    })();
});