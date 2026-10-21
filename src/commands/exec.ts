import { spawn } from "node:child_process";
import { loadConfig } from "../services/config.js";

export default async function exec(name?: string, list = false) {
    const config = await loadConfig();

    if (list) {
        const tasks = Object.keys(config.exec);
        if (tasks.length === 0) {
            console.log("Nenhuma tarefa configurada em adon.json.");
            return;
        }

        console.log("Tarefas disponíveis:");
        for (const task of tasks) {
            console.log(`  ${task}`);
        }
        return;
    }

    if (!name) {
        throw new Error("Informe o nome da tarefa. Use 'adon exec --list' para listar as tarefas.");
    }

    const command = config.exec[name];
    if (!command) {
        throw new Error(`Tarefa '${name}' não encontrada. Use 'adon exec --list' para listar as tarefas.`);
    }

    const exitCode = await new Promise<number>((resolve, reject) => {
        const child = spawn(command, {
            shell: true,
            stdio: "inherit",
        });

        child.once("error", reject);
        child.once("close", (code, signal) => {
            if (code !== null) {
                resolve(code);
                return;
            }

            console.error(`A tarefa '${name}' foi encerrada pelo sinal ${signal ?? "desconhecido"}.`);
            resolve(1);
        });
    });

    process.exitCode = exitCode;
    if (exitCode === 0) {
        console.log(`Tarefa '${name}' concluída com sucesso.`);
    } else {
        console.error(`Tarefa '${name}' falhou com código ${exitCode}.`);
    }
}
