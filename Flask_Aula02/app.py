from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='templates')

#Esta linha configura o caminho para o BD

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

#Estrutura da tabela do BD
class Tarefas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(100), unique=True, nullable=False)

#CRUD - READ
@app.route('/')
def index():
    #tarefas = Tarefas.query.all(): Esta linha interage com o BD para buscar as informações
    tarefas = Tarefas.query.all()
    return render_template('index.html', tarefas=tarefas)

#CRUD - CREATE
@app.route('/criar', methods=['POST'])
def criar_tarefas():
    descricao = request.form['descricao']

    tarefa_existente = Tarefas.query.filter_by(descricao=descricao).first()
    if tarefa_existente:
        return 'Erro: Tarefa já foi cadastrada!', 400

    #Criando uma nova instância da classe criada acima
    new_task = Tarefas(descricao=descricao)
    db.session.add(new_task)
    db.session.commit()
    return redirect('/')

#'/deletar/<int:id_tarefa>': Esta é uma rota dinâmica
#<...>: Indica que esta parte da URL é uma variável
#CRUD - DELETE
@app.route('/deletar/<int:id_tarefa>', methods=['POST'])
def deletar_tarefas(id_tarefa):
    tarefa = Tarefas.query.get(id_tarefa)
    if tarefa:
        db.session.delete(tarefa)
        db.session.commit()
    return redirect('/')

#CRUD - UPDATE
@app.route('/atualizar/<int:id_tarefa>', methods=['POST'])
def atualizar_tarefas(id_tarefa):
    tarefa = Tarefas.query.get(id_tarefa)
    if tarefa:
        tarefa.descricao = request.form['descricao']
        db.session.commit()
    return redirect('/')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)