import { getPortActiveTab } from './utils/helperFunctions'

const btnScrapingTab = document.getElementById('btn-scraping-tab')
const btnScrapingBg = document.getElementById('btn-scraping-background')
const btnScrapingData = document.getElementById('btn-scraping-data')

function addRow({ description }:{description:string}) {
    const tableBody = document.getElementById('tableBody')
    const newRow = document.createElement('tr')

    const descCell = document.createElement('td')
    descCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
    descCell.textContent = description

    newRow.appendChild(descCell)
    tableBody?.appendChild(newRow)
}

if(btnScrapingBg) {
    btnScrapingBg.addEventListener('click',
        async()=>{
            const portBackground = chrome.runtime.connect({name: "background"});
            portBackground.postMessage({ cmd: "getItems" });
        })
}

if(btnScrapingData) {
    btnScrapingData.addEventListener('click',
        async()=>{
            const portBackground = chrome.runtime.connect({name: "background"});
            portBackground?.onMessage.addListener( async ({ success, message, data}: { success: boolean; message: string; data: any })=> {
                if (!success) return
                data.items.forEach((element:string) => {
                    addRow({ description: element })
                });
            });
            portBackground.postMessage({ cmd: "getPopupItems" });
        })
}

if(btnScrapingTab) {
    btnScrapingTab.addEventListener('click',
        async()=>{
            const portTab = await getPortActiveTab()
            portTab?.onMessage.addListener( async ({ success, message, data}: { success: boolean; message: string; data: any })=> {
                if (!success) return
                data.forEach((element:string) => {
                    addRow({ description: element })
                });
            });
    
    
            portTab?.postMessage({ cmd: "getItems" });
        })
}