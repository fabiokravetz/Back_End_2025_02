from flask import Flask, render_template, request

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/', methods=['GET', 'POST'])
def calculadora():
    resultado = None
    if request.method == 'POST':
        num_01 = float(request.form['num_01'])
        num_02 = float(request.form['num_02'])
        op = request.form['op']

        if op == 'soma':
            resultado = round(num_01 + num_02, 2)
        elif op == 'subtracao':
            resultado = round(num_01 - num_02, 2)
        elif op == 'mult':
            resultado = round(num_01 * num_02, 2)
        elif op == 'divisao':
            resultado = (
                round(num_01 / num_02, 2)
                if num_02 != 0
                else "Erro: divisão por zero!!!"
            )

    return render_template('calculadora.html',resultado=resultado)

if __name__ == '__main__':
    app.run(debug=True)


