export default function executando(carregando: boolean, command?: string, code?: number){

    if(carregando === true){
        const load = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
        let i = 0;

        const loading = setInterval(() => {
            process.stdout.write(`\r${load[i]}`),
            i = ( i + 1) % load.length;
        }, 80);

        return () => {
            clearInterval(loading);
            process.stdout.write('\r\x1b[K');
        }
    } else {
        console.log(`\'${command}\',executado!`, `\ncódigo: ${code}`);
    }
}