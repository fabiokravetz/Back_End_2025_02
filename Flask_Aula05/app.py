from flask import Flask
from controllers import user_controller

app = Flask(__name__, template_folder='views/templates')

#Registra as rotas a partir do controller
user_controller.configure_routes(app)

if __name__ == '__main__':
    app.run(debug=True)