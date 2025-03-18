import { getPortActiveTab } from './utils/helperFunctions'
import { getProductCode } from './utils/openai'

(() => {

    function addRow({ description }: { description: string }) {
        const tableBody = document.getElementById('tableBody')
        const newRow = document.createElement('tr')

        const descCell = document.createElement('td')
        descCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
        descCell.textContent = description

        newRow.appendChild(descCell)
        tableBody?.appendChild(newRow)
    }

    let scrapedData: any[] = []

    function downloadJSON(data: any, filename: string) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
    }

    let btnScrapingTab = document.getElementById('btn-scraping-tab')
    if (btnScrapingTab) {
        btnScrapingTab.addEventListener('click', async () => {
            const portTab = await getPortActiveTab()
            portTab?.onMessage.addListener(async ({ success, message, data }: { success: boolean; message: string; data: any }) => {
                if (!success) return
                alert('Items obtenidos')
            })

            portTab?.postMessage({ cmd: "getItems" })
        })
    }

    let btnScrapingBg = document.getElementById('btn-scraping-background')
    if (btnScrapingBg) {
        btnScrapingBg.addEventListener('click', async () => {
            const portBackground = chrome.runtime.connect({ name: "background" })
            portBackground.postMessage({ cmd: "getItems" })
        })
    }

    let btnScrapingData = document.getElementById('btn-scraping-data')
    if (btnScrapingData) {
        btnScrapingData.addEventListener('click', async () => {
            const portBackground = chrome.runtime.connect({ name: "background" })
            portBackground.postMessage({ cmd: "getPopupItems" })
            portBackground?.onMessage.addListener(async ({ success, message, data }: { success: boolean; message: string; data: any }) => {
                if (!success) return
                data.items.forEach((item: any) => {
                    addRow({ description: item.brand })
                    scrapedData.push(item)  // Almacenar datos
                })
            })
        })
    }

    let btnDownloadJSON = document.getElementById('btn-download-json')
    if (btnDownloadJSON) {
        btnDownloadJSON.addEventListener('click', () => {
            if (scrapedData.length > 0) {
                downloadJSON(scrapedData, 'scraped_data.json')
            } else {
                alert('No hay datos disponibles para descargar.')
            }
        })
    }

    document?.getElementById('openFileUpload')?.addEventListener('click', function () {
        chrome.windows.create({
            url: chrome.runtime.getURL('file_upload.html'),
            type: 'popup',
            width: 400,
            height: 300
        })
    })

    document?.getElementById('imageForm')?.addEventListener('submit', function (event) {
        event.preventDefault()

        const btnUpload = document.getElementById('buttonUpload') as HTMLButtonElement;
        btnUpload.disabled = true;

        try {
            const fileInput = document.getElementById('imageInput') as HTMLInputElement;
            if (!fileInput?.files) return
            const file = fileInput?.files[0];

            if (!file) {
                alert('Por favor, selecciona una imagen.');
                btnUpload.disabled = false;
                return;
            }
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    if (!(typeof reader.result === 'string')) return
                    const apiKey = (document.getElementById('txtAPI') as HTMLInputElement)?.value
                    const base64Image = reader.result?.split(',')[1];

                    const result = await getProductCode(apiKey, base64Image)

                    const elementResponse = document.getElementById('response')

                    if (!elementResponse) return

                    elementResponse.innerText = JSON.stringify(result)

                    const btnUpload = document.getElementById('buttonUpload') as HTMLButtonElement;
                    btnUpload.disabled = false;

                } catch (e: any) {
                    alert(e.message)
                    const btnUpload = document.getElementById('buttonUpload') as HTMLButtonElement;
                    btnUpload.disabled = false;
                }

            }

            reader.readAsDataURL(file);
        } catch (e) {
            const btnUpload = document.getElementById('buttonUpload') as HTMLButtonElement;
            btnUpload.disabled = false;
        }
    });

})()
