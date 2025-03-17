import { getAllNewItems } from './utils/wong';

console.log('Estoy en contentScript 2.0')

chrome.runtime.onConnect.addListener(function(port){
    port.onMessage.addListener(async ({cmd})=>{
        console.log(cmd)
        if(cmd == "getItems"){
            const data = await getAllNewItems()
            port.postMessage({success:true,message:"Items obtenidos",data})
        }
    } )
})
