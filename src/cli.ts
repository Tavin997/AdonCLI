import init from "./commands/init.js";
import adon from "./commands/adon.js";
import exec from "./commands/exec.js";
import help from "./commands/help.js";
import { Commands } from "./consts/commands.js";
import { version } from "./commands/version.js";

export default async function cli() {
    const [command, ...params] = process.argv.slice(2);

    if (!command) {
        adon();
        return;
    }

    if ([Commands.help, "--help", "-h"].includes(command)) {
        help();
        return;
    }

    if ([Commands.version, "--version", "-v"].includes(command)) {
        console.log(version);
        return;
    }

    if (command === Commands.initialize) {
        if (params.length > 1 || (params.length === 1 && params[0] !== "--force")) {
            throw new Error("Uso inválido. Execute 'adon help' para ver as opções.");
        }

        await init(params[0] === "--force");
        return;
    }

    if (command === Commands.executions || command === Commands.run) {
        if (params.length === 1 && params[0] === "--list" && command === Commands.executions) {
            await exec(undefined, true);
            return;
        }

        if (params.length !== 1) {
            throw new Error("Informe o nome da tarefa. Use 'adon exec --list' para listar as tarefas.");
        }

        await exec(params[0]);
        return;
    }

    throw new Error(`Comando desconhecido: '${command}'. Execute 'adon help' para ver os comandos disponíveis.`);
}