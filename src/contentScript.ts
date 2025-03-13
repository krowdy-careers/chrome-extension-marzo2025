import { getItems } from './utils/wong';

console.log('Estoy en contentScript 2.0')

chrome.runtime.onConnect.addListener(function(port){
    port.onMessage.addListener(async ({cmd})=>{
        console.log(cmd)
        if(cmd == "getItems"){
            const data = getItems()
            port.postMessage({success:true,message:"Items obtenidos",data})
        }
    } )
})
