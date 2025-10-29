from flask import render_template, request, redirect, url_for
from models.user import User

def configure_routes(app):
    #Rota principal que exibe a lista de usuários
    @app.route('/')
    def index():
        #Busca todos os usuários usando a Model
        users = User.get_usuarios()
        return render_template('index.html', users=users)
    
    #Rota que exibe o formulário para adição de um usuário
    @app.route('/contact')
    def contact():
        return render_template('contact.html')
    
    #Rota para processar a criação de um novo usuário
    @app.route('/users/new', methods=['POST'])
    def create_user():
        name = request.form['name']
        email = request.form['email']
        #Chama o método da Model para criar um usuário no BD
        User.criar_usuario(name, email)
        return redirect(url_for('index'))