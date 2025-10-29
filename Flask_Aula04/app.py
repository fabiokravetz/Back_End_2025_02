from apiflask import APIFlask, Schema, fields
from apiflask.validators import Length
import mysql.connector
from mysql.connector import errorcode

db_config ={
    'host': 'localhost',
    'user': 'root',
    'password': 'fukuda',
    'database': 'crud_api'
}

def conexao():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Erro ao conectar ao BD: {err}")
        return None

#----FUNÇÃO PARA INICIALIZAR O BANCO DE DADOS E A TABELA---
def inicia_bd():
    try:
        conn = mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password']
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']} DEFAULT CHARACTER SET 'utf8'")
        print(f"Banco de dados '{db_config['database']}' criado.")

        cursor.close()
        conn.close()

        conn = conexao()
        if conn:
            cursor = conn.cursor()
            query_table = """
            CREATE TABLE IF NOT EXISTS livros(
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            autor VARCHAR(255) NOT NULL
            )
            """
            cursor.execute(query_table)
            print("Tabela 'livros' criada")
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Erro - Verifique o usuário e senha.")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print(f"Erro - O BD '{db_config['database']}' não existe")
        else:
            print(f"Ocorreu um erro genérico: {err}")
        exit(1) #Encerra a aplicação

#DEFINIÇÃO DOS SCHEMAS (MODELOS DE DADOS)

#Propósito: Define como devem ser os dados que um cliente
#envia para a API para criar um novo livro
class LivroInSchema(Schema):
    titulo = fields.String(required=True, validate=Length(min=1))
    autor = fields.String(required=True, validate=Length(min=1))

#Propósito: Define o formato dos dados que sua API envia
#de volta como resposta, ou seja, ao criar um novo livro
#ou listar os já existentes.
class LivroOutSchema(Schema):
    id = fields.Integer()
    titulo = fields.String()
    autor = fields.String()

app = APIFlask(__name__, title="API - Versão 01")

#ENDPOINT PARA CRIAR UM NOVO LIVRO (POST)
@app.post('/livros')
@app.input(LivroInSchema)#Valida os dados de entrada
@app.output(LivroOutSchema, status_code=201)
def criar_livro(json_data):
    titulo = json_data['titulo']
    autor = json_data['autor']

    conn = conexao()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "INSERT INTO crud_api.livros (titulo, autor) VALUES (%s, %s)"
        cursor.execute(query, (titulo, autor))

        novo_livro_id = cursor.lastrowid

        conn.commit()
        cursor.close()
        conn.close()

        livro_criado = {'id': novo_livro_id, 'titulo': titulo, 'autor': autor}
        return livro_criado
    
#ENDPOINT PARA LISTAR TODOS OS LIVROS (GET)
@app.get('/livros')
@app.output(LivroOutSchema(many=True)) #many=True indica que a saída é uma lista
def listar_livros():
    conn = conexao()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM crud_api.livros"
        cursor.execute(query)
        livros = cursor.fetchall()
        cursor.close()
        conn.close()
        return livros
    
if __name__ == '__main__':
    inicia_bd()
    app.run(debug=True)

#--------------------------EXERCÍCIO 01---------------------------------
#Conecte o backend desenvolvido (API) a um frontend, simulando um cenário
#de desenvolvimento.

# - Ver a lista de livros cadastrados.
# - Adicionar um novo livro através de um formulário.

#--------------------------EXERCÍCIO 02----------------------------------
#Implementar a parte faltante do CRUD e realizar os teste via APIFlask.
#Não é necessário HTML para esta parte.
