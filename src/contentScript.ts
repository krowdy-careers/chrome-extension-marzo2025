import { getItems } from './utils/wong';

console.log('Estoy en contentScript 2.0')

const buttonShowMore = async (): Promise<HTMLElement | null> => {

    let btn = document.querySelectorAll('.vtex-search-result-3-x-buttonShowMore')[1].firstElementChild as HTMLElement;
    while (btn.hasAttribute('disabled')) {
        console.log("⌛ Botón deshabilitado, esperando...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundo
    }
    btn.click();
    console.log("✅ Botón habilitado, haciendo clic...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    return btn;
};

// bucle para hacer click en el boton show more hasta que muestre todos items
const loadTotalItems = async () => {
    let btn = await buttonShowMore();
    if (btn) {

        await loadTotalItems();

    } else {
        console.log("🛒 Todos los items cargados");
    }
};


chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(async ({ cmd }) => {
        console.log("📩 Comando recibido:", cmd)
        if (cmd == "getItems") {
            await loadTotalItems();
            const data = getItems()
            port.postMessage({ success: true, message: "Items obtenidos", data })
        }
    })
})
