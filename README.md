# Desafio Técnico - Analista de Integrações

Este projeto é uma aplicação Node.js que simula a sincronização de dados de "Usuários/RH", processando e consolidando informações de forma automatizada.

## Tecnologias Utilizadas

- Node.js (v25.2.1)
- SQLite (para armazenamento local)
- Express (para criar o servidor e endpoints)
- Axios (para requisições HTTP)
- JavaScript (ES Modules)

## Funcionalidades

- Consumir dados da API [RandomUser](https://randomuser.me/api/)
- Normalizar e "achatar" os objetos de resposta (`flattenObject`)
- Inserir ou atualizar registros no banco de dados (`upsertFromObject`)
- Evitar duplicidade de usuários pelo e-mail
- Gerar relatório de inserções e atualizações

## Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- [Node.js](https://nodejs.org/) versão v25.2.1
- [npm](https://www.npmjs.com/) (geralmente vem com Node.js)
- SQLite instalado na máquina ou acessível via Node.js (biblioteca `sqlite3`)

- > Observação: O projeto cria automaticamente o banco local `database.db` na primeira execução.

## Instalação

## 1. Clone o repositório:

`
git clone https://github.com/LuizBahr/PaytrackRandomUser.git
cd PaytrackRandomUser
`
## 2. Instale as dependencias:
`
npm install
`

## 3. Inicie o servidor
`
npm start
`

O servidor será iniciado em: http://localhost:3000

Endpoints adicionais podem retornar dados processados da API RandomUser.

## Observações Importantes

A função existsByEmail garante que não haja duplicidade de usuários.

SQLite é usado apenas como banco local; pode ser substituído por outro banco SQL.

Relatórios de inserção e atualização são exibidos no console para monitoramento do processamento.

Exemplo de resposta:
```json
{
  "status": "OK",
  "operacao": "UPSERT por email",
  "chaveUnica": "email",
  "relatorio": "./reports/relatorio-2026-01-11T17-01-37.json",
  "resumo": {
    "totalRecebido": 150,
    "persistencia": {
      "inseridos": 150,
      "atualizados": 0
    }
  }
}
```

O projeto foi desenvolvido considerando escalabilidade e facilidade de adaptação para outros endpoints ou bancos de dados.

## Autor
Luiz Guilherme Bahr
