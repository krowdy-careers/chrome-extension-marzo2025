import { getPortActiveTab } from './utils/helperFunctions'
import * as XLSX from 'xlsx'; 

const btnScrapingTab = document.getElementById('btn-scraping-tab')
const btnScrapingBg = document.getElementById('btn-scraping-background')
const btnScrapingData = document.getElementById('btn-scraping-data')
const btnDonwloadAsExcel = document.getElementById('btn-donwload-as-excel')

function addRow({ description,price}:{description:string,price:string}) {
    const tableBody = document.getElementById('tableBody')
    const newRow = document.createElement('tr')

    const descCell = document.createElement('td')
    descCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
    descCell.textContent = description

    const priceCell = document.createElement('td')
    priceCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
    priceCell.textContent = price
    

    newRow.appendChild(descCell)
    newRow.appendChild(priceCell)

    tableBody?.appendChild(newRow)
}

if(btnScrapingBg) {
    btnScrapingBg.addEventListener('click',
        async()=>{
            const portBackground = chrome.runtime.connect({name: "background"});
            portBackground.postMessage({ cmd: "getItems" });
        })
}

if (btnScrapingData) {
    btnScrapingData.addEventListener('click', async () => {
        const portBackground = chrome.runtime.connect({ name: "background" });
        portBackground?.onMessage.addListener(async ({ success, message, data }: { success: boolean; message: string; data: any }) => {
            if (!success) return;

            // Iterar sobre los datos recibidos
            data.items.forEach(({ brand, price }: { brand: string; price: string }) => {
                addRow({ description:brand, price: price });
            });
        });

        portBackground.postMessage({ cmd: "getPopupItems" });
    });
}
 
if (btnScrapingTab) {
    btnScrapingTab.addEventListener('click', async () => {
        const portTab = await getPortActiveTab();
        portTab?.onMessage.addListener(async ({ success, message, data }: { success: boolean; message: string; data: any }) => {
            if (!success) return;

            data.forEach(({ brand, price }: { brand: string; price: string }) => {
                addRow({ description: brand, price: price });
            });
        });

        portTab?.postMessage({ cmd: "getItems" });
    });
}

if(btnDonwloadAsExcel){

    btnDonwloadAsExcel.addEventListener('click', () => {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;

        const rows = Array.from(tableBody.querySelectorAll('tr')).map(row => {
            const cells = row.querySelectorAll('td');
            return {
                brand: cells[0].textContent || '',
                price: cells[1].textContent || ''
            };
        });

        downloadExcel(rows);
    });
}

function downloadExcel(data: { brand: string; price: string }[]) {
    const worksheetData = data.map(item => [item.brand, item.price]);

    const worksheet = XLSX.utils.aoa_to_sheet([
        ['Marca', 'Precio'], 
        ...worksheetData    
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    XLSX.writeFile(workbook, 'productos.xlsx');
}