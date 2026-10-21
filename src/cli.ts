import init from "./commands/init.js";
import adon from "./commands/adon.js";
import exec from "./commands/exec.js";
import { Commands } from "./consts/commands.js";

export default function cli() {
    const [command, ...params] = process.argv.slice(2);

    if(!command && params.length == 0){
        adon();

    } else if(command == Commands.initialize && params.length == 0){
        init(command);

    } else if(command == Commands.executions && params.length > 0){
        const q = params[0];

        exec(q);
    }

    //console.log(command, params);
};