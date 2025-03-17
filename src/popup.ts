import { getPortActiveTab } from './utils/helperFunctions'

const btnScrapingTab = document.getElementById('btn-scraping-tab')
const btnScrapingBg = document.getElementById('btn-scraping-background')
const btnScrapingData = document.getElementById('btn-scraping-data')
const tableBody = document.getElementById('tableBody')

type ProductData = {
  productName: string,
  totalPrice: string
}

function addRow({ productName, totalPrice }: ProductData) {
    const newRow = document.createElement('tr')

    const descCell = document.createElement('td')
    descCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
    descCell.textContent = productName;

    const priceCell = document.createElement('td')
    priceCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
    priceCell.textContent = "S/." + totalPrice;

    newRow.appendChild(descCell)
    newRow.appendChild(priceCell);
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
                tableBody!.innerHTML = "";
                data.items.forEach((element: ProductData) => {
                    addRow({ productName: element.productName, totalPrice: element.totalPrice })
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
                tableBody!.innerHTML = "";
                data.forEach((element: ProductData) => {
                    addRow({ productName: element.productName, totalPrice: element.totalPrice })
                });
            });
    
    
            portTab?.postMessage({ cmd: "getItems" });
        })
}
