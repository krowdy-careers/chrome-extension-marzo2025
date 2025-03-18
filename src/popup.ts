import { getPortActiveTab } from './utils/helperFunctions'

const btnScrapingTab = document.getElementById('btn-scraping-tab')
const btnScrapingBg = document.getElementById('btn-scraping-background')
const btnScrapingData = document.getElementById('btn-scraping-data')
const btnErasingData = document.getElementById('btn-erasing-data')
const tableBody = document.getElementById('tableBody')
const nItemsElement = document.getElementById('nItems')

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

if (btnErasingData) {
    btnErasingData.addEventListener('click', () => {

        chrome.storage.local.remove("items", () => {
            console.log("items borrados");
        });

    })
}

/// si los items cambian (se borran, crecen, cambian...) actualizar tabla
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.items) {
        updateTable({ items: changes.items.newValue || [] });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    if (tableBody) {
        // alert('tabla existe')
        loadStoredItems()
    }


    document.querySelector(".vtex-search-result-3-x-buttonShowMore button")?.addEventListener("click", () => {
        alert('click')
        setTimeout(() => {
            alert('aaaaaaaaaa')
            window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
        }, 2000);
    });

});


// cargar los datos almacenados al abrir el popup
async function loadStoredItems() {
    const portBackground = chrome.runtime.connect({ name: "background" });

    portBackground.onMessage.addListener(async ({ success, message, data }: { success: boolean; message: string; data: any }) => {
        if (!success) return;

        updateTable(data)
    });

    // mensaje al background para obtener los datos guardados
    portBackground.postMessage({ cmd: "getPopupItems" });
}

function updateTable(data: any) {
    if (!tableBody) return;

    // alert('actualizando tabla')
    tableBody.innerHTML = "";

    data.items.forEach((element: string) => {
        addRow({ description: element });
    });

    if (nItemsElement) {
        nItemsElement.textContent = data.items.length
    }
};
