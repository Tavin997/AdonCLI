import executando from '../utils/executando.js';

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export default async function init(command: string) {
    const pararLoading = executando(true);

    const dir = process.cwd();

    const conf = {
        projeto: `${dir.split('/').at(-1)}`,
        versão: 'V1.0.0',
        exec: {
            "test": "inclua uma execução aqui!"
        }
    };

    const file = join(dir, 'adon.json');

    await writeFile(
        file,
        JSON.stringify(conf, null, 2)
    );

    if(pararLoading){
        pararLoading();
        process.exitCode = 0;
        executando(false, command, process.exitCode);
    }
}