export default function help() {
    console.log(`AdonCLI - gerenciamento de tarefas de projeto

Uso:
  adon                         Exibe o banner
  adon init [--force]          Cria adon.json; --force substitui o arquivo existente
  adon exec <tarefa>           Executa uma tarefa configurada
  adon exec --list             Lista as tarefas disponíveis
  adon run <tarefa>            Alias para exec
  adon --version               Exibe a versão
  adon --help                  Exibe esta ajuda`);
}
