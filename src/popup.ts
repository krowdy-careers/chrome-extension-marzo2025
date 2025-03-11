import { getPortActiveTab } from './utils/helperFunctions'


( ()=>{

    function addRow({ description }:{description:string}) {
        const tableBody = document.getElementById('tableBody')
        const newRow = document.createElement('tr')

        const descCell = document.createElement('td')
        descCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
        descCell.textContent = description

        newRow.appendChild(descCell)
        tableBody?.appendChild(newRow)
    }

    let btnScrapingTab = document.getElementById('btn-scraping-tab')

    if(btnScrapingTab) {
        btnScrapingTab.addEventListener('click',
            async()=>{
                const portTab = await getPortActiveTab()
                portTab?.onMessage.addListener( async ({ success, message, data}: { success: boolean; message: string; data: any })=> {
                    if (!success) return
                    alert('Items obtenidos')
                });
        
        
                portTab?.postMessage({ cmd: "getItems" });
            })
    }
   

    let btnScrapingBg = document.getElementById('btn-scraping-background')
    if(btnScrapingBg) {
        btnScrapingBg.addEventListener('click',
            async()=>{
                const portBackground = chrome.runtime.connect({name: "background"});
                portBackground.postMessage({ cmd: "getItems" });
            })
    }

    

    

    let btnScrapingData = document.getElementById('btn-scraping-data')
    if(btnScrapingData) {
        btnScrapingData.addEventListener('click',
            async()=>{
                const portBackground = chrome.runtime.connect({name: "background"});
                portBackground.postMessage({ cmd: "getPopupItems" });
                portBackground?.onMessage.addListener( async ({ success, message, data}: { success: boolean; message: string; data: any })=> {
                    if (!success) return
                    data.items.forEach( (item:any) => {
                        addRow({description:item.brand})
                    })
                    
                });
            })
    
    }

    document?.getElementById('openFileUpload')?.addEventListener('click', function() {
        chrome.windows.create({
            url: chrome.runtime.getURL('file_upload.html'),
            type: 'popup',
            width: 400,
            height: 300
        });
    });


    document?.getElementById('imageForm')?.addEventListener('submit', function(event) {
        event.preventDefault();
    
        const fileInput = document.getElementById('imageInput') as HTMLInputElement;;
        if (! fileInput?.files) return
        const file = fileInput?.files[0];
    
        if (!file) {
            alert('Por favor, selecciona una imagen.');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async function() {
            if (!(typeof reader.result === 'string')) return
            const apiKey = (document.getElementById('txtAPI') as HTMLInputElement)?.value
            const base64Image = reader.result?.split(',')[1];
            const url = 'https://api.openai.com/v1/images/analysis';
    
           
            const body = JSON.stringify({
                model: 'gpt-4o',
                response_format: { type: 'json_object' },
                messages: [
                  {
                    role: 'user',
                    content: [
                      { type: 'text', text: 'Extrae el product code del siguiente documento. devuelvelo en formato JSON' },
                      { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                  }
                ]
              });
    
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body
            });
    
            const result = await response.json();

            const elementResponse = document.getElementById('response')

            if (!elementResponse) return

            const productCodeResult = JSON.parse(result.choices[0].message.content);

            console.log(productCodeResult)
            elementResponse.innerText = result.choices[0].message.content
        };
        reader.readAsDataURL(file);
    });

}
)()

