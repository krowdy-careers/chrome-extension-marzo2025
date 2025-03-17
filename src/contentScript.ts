import { getItems } from './utils/metro';

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async ({ cmd }) => {
        if (cmd === "getItems") {
            try {
                const data = await getItems(); 
                port.postMessage({ 
                    success: true, 
                    message: "Items obtenidos", 
                    data 
                });
            } catch (error) {
                port.postMessage({ 
                    success: false, 
                    message: "Error al obtener items",
                    data: null
                });
            }
        }
    });
});