#Importa bibliotecas que permitem interagir com o sistema operacional, como listar arquivos em um diretório
import os
from flask import Flask, render_template, redirect, url_for, send_from_directory, request
from werkzeug.utils import secure_filename

app = Flask(__name__, template_folder='templates')
UPLOAD_FOLDER = "C:\\Users\\fabio\\OneDrive\\Área de Trabalho\\Python_terça\\Aula03\\diretorio"

#Rota principal - Mostra o formulário e a lista de arquivos

@app.route('/')
def index():
    arquivos=[]
    for nome_arquivo in os.listdir(UPLOAD_FOLDER):
        caminho = os.path.join(UPLOAD_FOLDER, nome_arquivo)
        if os.path.isfile(caminho):
            arquivos.append(nome_arquivo)
    return render_template('index.html', arquivos=arquivos)

#UPLOAD
@app.route('/diretorio', methods=['POST'])
def upload():
    if 'meuArquivo' not in request.files:
        return redirect(request.url)
    file = request.files['meuArquivo']

    if file.filename == '':
        return redirect(request.url)
    
    if file:
        filename = secure_filename(file.filename)
        savePath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(savePath)
        return redirect(url_for('index'))
    return redirect(request.url)

#DOWNLOAD
@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)