import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface AdonConfig {
    projeto: string;
    versão: string;
    exec: Record<string, string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function loadConfig(directory = process.cwd()): Promise<AdonConfig> {
    const file = join(directory, "adon.json");
    let content: string;

    try {
        content = await readFile(file, "utf-8");
    } catch (error) {
        if (isRecord(error) && error.code === "ENOENT") {
            throw new Error("adon.json não encontrado. Execute 'adon init' para criar a configuração.");
        }

        throw error;
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(content);
    } catch {
        throw new Error("adon.json contém JSON inválido. Corrija o arquivo antes de continuar.");
    }

    if (
        !isRecord(parsed)
        || typeof parsed.projeto !== "string"
        || parsed.projeto.trim().length === 0
        || typeof parsed.versão !== "string"
        || parsed.versão.trim().length === 0
        || !isRecord(parsed.exec)
    ) {
        throw new Error("Configuração inválida: informe 'projeto', 'versão' e um objeto 'exec' em adon.json.");
    }

    const tasks: Record<string, string> = {};
    for (const [name, command] of Object.entries(parsed.exec)) {
        if (name.trim().length === 0 || typeof command !== "string" || command.trim().length === 0) {
            throw new Error(`Configuração inválida: a tarefa '${name}' deve ter um comando não vazio.`);
        }

        tasks[name] = command;
    }

    return {
        projeto: parsed.projeto,
        versão: parsed.versão,
        exec: tasks,
    };
}
