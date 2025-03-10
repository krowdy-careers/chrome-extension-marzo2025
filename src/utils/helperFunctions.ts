// src/utils/helperFunctions.ts

/**
 * Capitaliza la primera letra de una cadena.
 * @param texto - La cadena a modificar.
 * @returns La cadena con la primera letra en mayúscula.
 */


const sleep = (seconds:number)=>{
    const secondsToMiliseconds = 1000;
    
    return new Promise((resolve:any)=>{
        setTimeout(
            ()=>{
                resolve();
            },
            seconds*secondsToMiliseconds)
    })
}

export {sleep}