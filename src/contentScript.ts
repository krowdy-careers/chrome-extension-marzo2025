import { getItems } from './utils/wong';

console.log('Estoy en contentScript 2.0')

chrome.runtime.onConnect.addListener(function(port){
    port.onMessage.addListener(async ({cmd})=>{
        console.log(cmd)
        if(cmd == "getItems"){
            const data = await getItems()
            port.postMessage({success:true,message:"Items obtenidos",data})
        }
    } )
})

document.addEventListener("click", (event) => {
    const target = event.target as Element; 
    const BUTTON_SELECTOR = 'vtex-search-result-3-x-buttonShowMore button'

    console.log(target) //<- Scroll en click a cualquier espacio de la página. Cuando hace click en cualquier elemento, lo muestra en consola, pero cuando hace clic en el btn no muestra nada
 
        setTimeout(() => {
            window.scrollBy({ top: window.innerHeight * 0.9, left: 0, behavior: "smooth" });
        }, 5000);
    
});
