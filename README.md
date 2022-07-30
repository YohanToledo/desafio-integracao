# Desafio de Integração


Passos para executar o projeto

## Instalação

Na pasta raiz do projeto utilize o comando
```bash
npm install -y
```

Após a instalação de todos os pacotes execute o comando de inicialização da aplicação
```bash
npm start
```
A aplicação vai estar rodando por padrão em: localhost:3000


## Funcionamento

Ao acessar a aplicação no navegador, serão solicitadas 3 informações:
- Chave api do googleapis;
- ID da planilha do googlesheets;
- Token da plataforma hubspot;

Guia para a criação da chave api google: https://support.google.com/googleapi/answer/6158862?hl=en

O ID da planilha que é encontrado na url de acesso a ela.
Para esse projeto pode ser utilizada esta [planilha](https://docs.google.com/spreadsheets/d/1W3mvzjz9jT9VULQdv8gdjjEdhcqfbAcsgHgORJzACSE/edit#gid=0); 
cujo id é: 1W3mvzjz9jT9VULQdv8gdjjEdhcqfbAcsgHgORJzACSE

E por fim será necessário o token gerado no hubspot: 
https://developers.hubspot.com/docs/api/developer-guides-resources


## Com esses dados a aplicação irá acessar a planilha, exportar os dados, organizar e validar, e após isso importar para os contatos dentro do hubspot.
