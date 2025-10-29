from flask import Flask, render_template

#O name faz uma referência ao próprio arquivo e garante que a aplicação vai rodar.
app = Flask(__name__, template_folder='templates', static_folder='static')

#Observação:
# __name__: Indica o módulo atual
# template_folder='templates': Define a pasta onde estão os arquivos html
# static_folder='static': Define a pasta para arquivos estáticos (css, js, imagens e afins...)

#Rotal -> Quando se coloca somente a barra ('/'), esta é a página raiz do nosso aplicativo
@app.route('/inicio')
def homepage():
    mensagem = 'Hello World!'
    return render_template('index.html', mensagem=mensagem)

#Verifica se o script está sendo executado
if __name__ == '__main__':
    app.run(debug=True)

#O parâmetro debug=True ativa:
# - Modo debug (mostra os erros detalhados)
# - Recarregamento automático quando o código é alterado