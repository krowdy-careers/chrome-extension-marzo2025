import { getItems ,getAllCategoryData} from './utils/wong';
import {load_complete} from './utils/helperFunctions'
console.log('Estoy en contentScript 2.0')

chrome.runtime.onConnect.addListener(function(port){


       


        port.onMessage.addListener(async ({ cmd }) => {
            if (cmd === "getItems") {
                // await load_completed();
                const data = await getAllCategoryData();
                port.postMessage({ success: true, message: "Items obtenidos", data });
            }

           
        });
    

  
})
