#!/usr/bin/env node
import cli from './cli.js';

cli().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Erro: ${message}`);
    process.exitCode = 1;
});