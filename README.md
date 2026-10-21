# AdonCLI

AdonCLI executa tarefas de projeto definidas em um arquivo `adon.json`.

## Requisitos

- Node.js 20 ou superior
- npm

## Desenvolvimento

```sh
npm install
npm run build
npm test
```

## Uso

Inicialize a configuração na raiz do projeto:

```sh
adon init
```

O comando cria `adon.json` e não substitui um arquivo existente. Para substituir a configuração explicitamente:

```sh
adon init --force
```

Exemplo de configuração:

```json
{
  "projeto": "meu-projeto",
  "versão": "V1.0.0",
  "exec": {
    "test": "npm test",
    "build": "npm run build"
  }
}
```

Execute tarefas pelo nome:

```sh
adon exec test
adon run build
```

Liste as tarefas disponíveis:

```sh
adon exec --list
```

Os comandos configurados são executados pelo shell no diretório atual. Configure-os apenas em projetos e arquivos nos quais confia.

## Ajuda

```sh
adon --help
adon --version
```
