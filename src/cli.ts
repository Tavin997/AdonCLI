import init from "./commands/init.js";
import adon from "./commands/adon.js";

export default function cli() {
    const [command, ...params] = process.argv.slice(2);

    if(!command && params.length == 0){
        adon();        
    } else if(command == 'init' && params.length == 0){
        init(command);
    }

    //console.log(command, params);
}