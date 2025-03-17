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

const getPortActiveTab = async ()=>{
    const [tab] = await chrome.tabs.query({ active: true })
    if(!tab.id) return
    const portTab = chrome.tabs.connect(tab.id, { name: "content-script-port" })
    return portTab
}

const saveObjectInLocalStorage = async function (obj:any) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(obj, function () {
          resolve(obj);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };
  
  const getObjectInLocalStorage = async function (key:any) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get([key], function (value) {
          resolve(value);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };

  const clearLocalStorage = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        chrome.storage.local.clear(() => {
          resolve()
        });
      } catch (ex) {
        reject(ex)
      }
    })
  }

export {sleep,getPortActiveTab,getObjectInLocalStorage,saveObjectInLocalStorage,clearLocalStorage} 