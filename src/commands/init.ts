import executando from '../utils/executando.js';

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export default async function init(command: string) {
    const pararLoading = executando(true);

    const dir = process.cwd();

    const path = join(dir, '.adon');

    await mkdir(path, {recursive: true });

    const conf = {
        projeto: `${dir.split('/').at(-1)}`,
        versão: 'V1.0.0',
        exec: {
            "test": "sem executável especificado && echo $?"
        }
    };

    const file = join(dir, '.adon/adonConf.json');

    await writeFile(
        file,
        JSON.stringify(conf, null, 2)
    );

    setTimeout(() => {
        if(pararLoading){
            pararLoading();
            process.exitCode = 0;
            executando(false, command, process.exitCode);
        }
    }, 3000)
}