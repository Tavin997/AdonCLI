import { writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

export default async function init(force = false) {
    const file = join(process.cwd(), "adon.json");
    const config = {
        projeto: basename(process.cwd()),
        versão: "V1.0.0",
        exec: {
            test: "echo \"Configure sua primeira tarefa\"",
        },
    };

    try {
        await writeFile(file, JSON.stringify(config, null, 2), {
            encoding: "utf-8",
            flag: force ? "w" : "wx",
        });
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "EEXIST") {
            throw new Error("adon.json já existe. Use 'adon init --force' para substituí-lo.");
        }

        throw error;
    }

    console.log(`Configuração criada em ${file}`);
}