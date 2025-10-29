from flask import Flask
from controllers import login_controller

app = Flask(__name__, template_folder='views/templates', static_folder='views/static')

#Carrega as informações do arquivo config.py
#Carrega as infos de SECRET_KEY e DB_CONFIG para dentro do objeto
#de configuração da aplicação
app.config.from_object('config.Config')

login_controller.configura_rotas(app)

if __name__ == '__main__':
    app.run(debug=True)













# Crie uma aplicação onde o usuário depois de logado tenha a 
# possibilidade de cadastrar um produto. A tabela de produtos
# deve possuir pelo menos as informações referente ao nome e
# descrição de um produto qualquer.