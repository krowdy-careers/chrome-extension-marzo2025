import { sleep } from './utils/helperFunctions';

(
    async () => {
        console.log('Esperando 2 segundos...');
        await sleep(2);
        console.log('Han pasado 2 segundos');
    }
)()
