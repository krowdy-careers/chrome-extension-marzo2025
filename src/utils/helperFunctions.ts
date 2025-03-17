// src/utils/helperFunctions.ts

import { Category, DataWong } from "./wong";



/**
 * Capitaliza la primera letra de una cadena.
 * @param texto - La cadena a modificar.
 * @returns La cadena con la primera letra en mayúscula.
 */


const sleep = (seconds: number) => {
  const secondsToMiliseconds = 1000;

  return new Promise((resolve: any) => {
    setTimeout(
      () => {
        resolve();
      },
      seconds * secondsToMiliseconds)
  })
}

const getPortActiveTab = async () => {

  try{
  const [tab] = await chrome.tabs.query({ active: true ,currentWindow:true})
  if (!tab?.id) return
  const portTab = chrome.tabs.connect(tab.id, { name: "content-script-port" })
  return portTab
  
  }catch(e){
    throw new Error(" erro in tab")
  }
}

const saveObjectInLocalStorage = async function (obj:DataWong) :Promise<void>{
  return new Promise((resolve, reject) => {
    try {

      if(obj?.listProducts){
        chrome.storage.local.set({items:obj.listProducts}, function () {
          resolve();
        });

      }else{

        reject(new Error("list in null"));
      }
      
    } catch (ex) {
      reject(ex);
    }
  });
};

const getObjectInLocalStorage = async function (key:string) : Promise<{items:Category[]}>{
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([key], function (value) {

        if(value && value.items)
        resolve({items:value.items as Category[]});
      });
    } catch (ex) {
      reject(ex);
    }
  });
};


const load_complete = async () => {
  console.log("Load function executing...");

  const btd_show_more = "button.vtex-button.bw1.ba.fw5.v-mid.relative.pa0.lh-solid.br2.min-h-small.t-action--small.bg-action-primary.b--action-primary.c-on-action-primary.hover-bg-action-primary.hover-b--action-primary.hover-c-on-action-primary.pointer";

  while (true) {
      let btn: HTMLButtonElement | null = document.querySelector(btd_show_more);
      if (!btn) {
          console.log("Load complete: no more buttons.");
          break;
      }

      try {
          btn.click();
          console.log("Button clicked, waiting...");
          await sleep(1); // Espera 1 segundo para que la página cargue más contenido
      } catch (err) {
          console.error("Error clicking button:", err);
          break;
      }
  }

  console.log("Load complete.");
}

export { sleep, getPortActiveTab, getObjectInLocalStorage, saveObjectInLocalStorage ,load_complete} 