import { getPortActiveTab, load_complete } from './utils/helperFunctions'
import { DataWong,Category } from './utils/wong'

const btnScrapingTab = document.getElementById('btn-scraping-tab')  //btn-scraping-tab
const btnScrapingBg = document.getElementById('btn-scraping-background')
const btnScrapingData = document.getElementById('btn-scraping-data')
let category= document.getElementById("wong-category") as HTMLElement;

function addRow({ description }:{description:string}) {
    const tableBody = document.getElementById('tableBody')
    const newRow = document.createElement('tr')

    const descCell = document.createElement('td')
    descCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
    descCell.textContent = description

    newRow.appendChild(descCell)
    tableBody?.appendChild(newRow)
}




//bgScraping
if(btnScrapingBg) {
    btnScrapingBg.addEventListener('click',
        async()=>{
          
          
            const portBackground = chrome.runtime.connect({name:"background"});
            portBackground.postMessage({ cmd: "getItems" });
            
        })
}

// get data from local storage
if(btnScrapingData) {
    btnScrapingData.addEventListener('click',
        async()=>{
            const portBackground = chrome.runtime.connect({name: "background"});
            portBackground?.onMessage.addListener( async ({ success, message, data}: { success: boolean; message: string; data:{items:Category[]}})=> {
                if (!success) return

                data.items.forEach((element:Category) => {
                   addRow({ description: JSON.stringify(element) })
                  
                });
            });
            portBackground.postMessage({ cmd: "getPopupItems" });
        })
}


//isnt save in local storage and porname is content-port-script
if(btnScrapingTab) {
    btnScrapingTab.addEventListener('click',
        async()=>{
            const portTab = await getPortActiveTab()
        
            portTab?.onMessage.addListener( async ({ success, message, data}: { success: boolean; message: string; data:DataWong })=> {
                if (!success) return
                
              
                if(category)
                 category.textContent=data.category;

                data.listProducts?.forEach((element:Category) => {
                   addRow({ description: JSON.stringify(element) })
                
                   
                });
            });
    
    
            portTab?.postMessage({ cmd: "getItems" });
        })
}