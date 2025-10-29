# import requests
# from bs4 import BeautifulSoup

# res = requests.get('https://www.paranaclinicas.com.br/')
# print(res.status_code)
# print('\n')
# print(res.headers)
# print('\n')
# print(res.content)
# site = BeautifulSoup(res.text, 'html.parser')
# print(site.prettify())
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

service = Service('C:\\Users\\fabio\\OneDrive\\Área de Trabalho\\Python_terça\\Aula_03_WebScraping\\msedgedriver.exe')

edge_options = Options()
edge_options.add_argument('--start-maximized--')

navegador = webdriver.Edge(service=service, options=edge_options)
navegador.get('https://www.airbnb.com.br/')

time.sleep(5)

try:
     botao_aceitar = WebDriverWait(navegador, 10).until(
        EC.element_to_be_clickable((By.XPATH, '//button[text()="Aceitar todos"]')))
     #Clica no botão
     botao_aceitar.click()
     print("Botão 'Aceitar todos' clicado com sucesso")
except Exception as e:
     print(f"Não foi possível encontrar ou clicar no botão: {e}")

#Procura pelo elemento input usando o xpath
campo_input = navegador.find_element(By.XPATH, '//input[contains(@placeholder, "Buscar destinos")]')
#Digita a palavra São Paulo
campo_input.send_keys("São Paulo")
#Aperta a tecla ENTER
campo_input.send_keys(Keys.ENTER)
     
input("Pressione ENTER para fechar o navegador...")
navegador.quit()
