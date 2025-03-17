
import { getPortActiveTab, saveObjectInLocalStorage, getObjectInLocalStorage } from './utils/helperFunctions'
import { DataWong,Category } from './utils/wong';
console.log('Estoy en background 2.0')
chrome.runtime.onConnect.addListener(async (port) => {
  console.log(`port name: ${port.name}`);

  type Ga={
    success:boolean,
    message?:string,
    data:DataWong
  }
  //if (port.name === "background" || port.name ==="content-script-port") {
    port.onMessage.addListener( async ({cmd})=>{
      if (cmd === "getItems"){
        const portTab = await getPortActiveTab()

        portTab?.postMessage({ cmd: "getItems" });

        portTab?.onMessage.addListener( async (go:Ga)=> {
            if (!go.success) return //console.log(message)
            await saveObjectInLocalStorage(go.data)
            
        });
      }
      if (cmd === "getPopupItems"){
        const data = await getObjectInLocalStorage("items")
        if(!data){
          alert("no hay datos guaradados");
        }
        port.postMessage({success:true,message:"Items obtenidos",data})
      }
    });



  //}

});