import { getItems ,getAllCategoryData} from './utils/wong';

console.log('Estoy en contentScript 2.0')

chrome.runtime.onConnect.addListener(function(port){


  //  if (port.name === "content-script-port" || port.name==="background") {


        port.onMessage.addListener(async ({ cmd }) => {
            if (cmd === "getItems") {
                const data = await getAllCategoryData();
                port.postMessage({ success: true, message: "Items obtenidos", data });
            }

           
        });
    

  /*  if( port.name==="background"){

        port.onMessage.addListener(async ({ cmd }) => {
            if (cmd === "getItems") {
                const data = await getAllCategoryData();
                port.postMessage({ success: true, message: "Items obtenidos", data });
            }

           
        });
    }
   */
})
