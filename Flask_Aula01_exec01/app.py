from flask import Flask, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/times')
def times():
    mensagem = 'Times Brasileiros'
    lista_times = ['Palmeiras', 'Corinthians', 'Vitória', 'Cruzeiro', 'Paysandu', 'São Paulo', 'Goiás']
    return render_template('lista.html', mensagem=mensagem, lista=lista_times)

if __name__ == '__main__':
    app.run(debug=True)