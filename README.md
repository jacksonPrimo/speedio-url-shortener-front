# speedio-url-shortener-front

## sobre o projeto :computer:

Este projeto tem como principal função criar URLs de redirecionamento curtas e fáceis de compartilhar.

## lista de comandos :space_invader:

```bash
# instalar as depêndencias do projeto:
$ npm install

# rodar a aplicação em modo de desenvolvimento, com hot reload no endereço 'localhost:3000':
$ npm run dev

# gerar uma pasta dist do projeto com seu build:
$ npm build

# rodar os testes unitários
$ npm run test:unit

# rodar os testes de integração usando cypress
$ npm run test:e2e
```

## Diretórios do projeto
Aqui estão alguns diretórios importantes para uma boa familiarização do projeto

### `components`

Este diretório contém componentes que abstraem uma lógica própria e que podem ser reaproveitados pelas paginas da aplicação

### `layouts`

Este diretório contém involocrus que envelopam as paginas que os encorporam. Em outras palavras são componentes que possuem uma parte renderizada dinamicamente pela pagina que faz uso da mesma.

### `views`

Este diretório abriga as paginas da aplicação.

### `assets`

Este diretório contem arquivos estaticos como imagens, css, fontes etc.

### `store`

Este diretório contem arquivos relacionados a pinia contendo as regras do gerenciamento de estado da aplicação.

### `plugins`

Este diretório contem plugins personalizados para o vue.

### `router`

Este diretório contem o arquivo de rotas da aplicação e os middlewares de acesso.

### `cypress`

Este diretório contém os arquivos a dados referentes ao teste de integração.

### `test`

Este diretório contém os arquivos a dados referentes ao teste unitário.