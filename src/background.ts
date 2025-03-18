import { getPortActiveTab,saveObjectInLocalStorage,getObjectInLocalStorage } from './utils/helperFunctions'

console.log('Estoy en background 2.0')
chrome.runtime.onConnect.addListener(async (port) =>{
    port.onMessage.addListener( async ({cmd})=>{
      if (cmd === "getItems"){
        const portTab = await getPortActiveTab()
        portTab?.postMessage({ cmd: "getItems" });
        portTab?.onMessage.addListener( async ({ success,message,data})=> {
            if (!success) console.log(message)
            await saveObjectInLocalStorage({items:data})
        });
      }
      if (cmd === "getPopupItems"){
        const data = await getObjectInLocalStorage("items")
        port.postMessage({success:true,message:"Items obtenidos",data})
      }
    });
  });
  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            if (tab.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["contentScript.js"]
                });
            }
        }
    });
});
