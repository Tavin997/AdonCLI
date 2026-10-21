import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(new URL("../dist/index.js", import.meta.url));

async function withProject(run) {
    const directory = await mkdtemp(join(tmpdir(), "adoncli-test-"));
    try {
        await run(directory);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
}

function invoke(directory, ...args) {
    return spawnSync(process.execPath, [cliPath, ...args], {
        cwd: directory,
        encoding: "utf-8",
    });
}

async function writeConfig(directory, exec) {
    await writeFile(join(directory, "adon.json"), JSON.stringify({
        projeto: "teste",
        versão: "V1.0.0",
        exec,
    }));
}

test("exibe ajuda e versão", () => {
    const help = invoke(process.cwd(), "--help");
    assert.equal(help.status, 0);
    assert.match(help.stdout, /adon exec --list/);

    const version = invoke(process.cwd(), "--version");
    assert.equal(version.status, 0);
    assert.match(version.stdout, /1\.0\.0/);
});

test("init cria a configuração padrão sem substituir arquivo existente", async () => {
    await withProject(async (directory) => {
        const created = invoke(directory, "init");
        assert.equal(created.status, 0);

        const config = JSON.parse(await readFile(join(directory, "adon.json"), "utf-8"));
        assert.equal(config.projeto, basename(directory));
        assert.equal(config.exec.test, 'echo "Configure sua primeira tarefa"');

        const duplicate = invoke(directory, "init");
        assert.equal(duplicate.status, 1);
        assert.match(duplicate.stderr, /--force/);
    });
});

test("init --force substitui configuração existente", async () => {
    await withProject(async (directory) => {
        await writeConfig(directory, { previous: "echo antigo" });

        const result = invoke(directory, "init", "--force");
        assert.equal(result.status, 0);

        const config = JSON.parse(await readFile(join(directory, "adon.json"), "utf-8"));
        assert.ok("test" in config.exec);
        assert.ok(!("previous" in config.exec));
    });
});

test("lista e executa tarefas com alias e preserva código de saída", async () => {
    await withProject(async (directory) => {
        await writeConfig(directory, {
            ok: "node -e \"process.exit(0)\"",
            fail: "node -e \"process.exit(7)\"",
        });

        const list = invoke(directory, "exec", "--list");
        assert.equal(list.status, 0);
        assert.match(list.stdout, /ok/);
        assert.match(list.stdout, /fail/);

        const success = invoke(directory, "run", "ok");
        assert.equal(success.status, 0);
        assert.match(success.stdout, /concluída com sucesso/);

        const failure = invoke(directory, "exec", "fail");
        assert.equal(failure.status, 7);
        assert.match(failure.stderr, /falhou com código 7/);
    });
});

test("reporta configuração ausente, inválida e tarefas desconhecidas", async () => {
    await withProject(async (directory) => {
        const missing = invoke(directory, "exec", "test");
        assert.equal(missing.status, 1);
        assert.match(missing.stderr, /adon.json não encontrado/);

        await writeFile(join(directory, "adon.json"), "{ inválido");
        const malformed = invoke(directory, "exec", "test");
        assert.equal(malformed.status, 1);
        assert.match(malformed.stderr, /JSON inválido/);

        await writeConfig(directory, { test: "" });
        const invalid = invoke(directory, "exec", "test");
        assert.equal(invalid.status, 1);
        assert.match(invalid.stderr, /comando não vazio/);

        await writeConfig(directory, { test: "echo ok" });
        const unknown = invoke(directory, "exec", "missing");
        assert.equal(unknown.status, 1);
        assert.match(unknown.stderr, /não encontrada/);
    });
});
