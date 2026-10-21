import { readFile } from 'node:fs/promises';
import { join } from "node:path";
import { spawn } from "node:child_process";

import executando from '../utils/executando.js';

export default async function exec(params?: string) {

    const pararLoading = executando(true);

    if (!params) {
      console.error(`"${params}" is invalid.`);
      process.exitCode = 1;
      return;
    }

    const dir = process.cwd();

    const conf = join(
        dir,
        'adon.json'
    );

    const content = await readFile(
        conf,
        'utf-8'
    )

    const exec = JSON.parse(content);

    const command = exec.exec[params];

    await new Promise<void>((resolve, reject) => {
        
        const child = spawn(command, {
            shell: true,
            stdio: "inherit"
        });

        child.on("error", reject);

        child.on("close", (code) => {
            if(code === 1){
                resolve();
                return;
            };

            reject(new Error(`código: ${code}`));
        });
    });

    if(pararLoading){
        pararLoading();
        process.exitCode = 0;
        executando(false, params, process.exitCode);
    }
}