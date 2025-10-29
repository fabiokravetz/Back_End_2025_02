class Config:

    #O mecanismo de sessão do Flask exige que a SECRET_KEY esteja configurada. Essa chave é usada para assinar criptograficamente os cookies de sessão, garantindo que eles não possam ser modificados pelo usuário no navegador.

    #Quando um usuário faz login, o Flask cria um "cookie de sessão" no navegador do usuário. Para evitar que esse cookie seja adulterado, o Flask o "assina" criptograficamente usando a SECRET_KEY.

    SECRET_KEY = 'Professor123'
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'root',
        'password': 'fukuda',
        'database': 'login_usuarios'
    }