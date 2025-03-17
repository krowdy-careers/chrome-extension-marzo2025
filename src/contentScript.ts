import { getItems } from './utils/wong';

console.log('Estoy en contentScript 2.0')
const scrollToBottom = () => {
    window.scrollBy({ top: window.innerHeight * 9, behavior: 'smooth' });
    console.log("Scroll 📜");
}
//auto click en el boton show more hasta que muestre todos items
const buttonShowMore = async (): Promise<HTMLElement | null> => {

    let btn = document.querySelectorAll('.vtex-search-result-3-x-buttonShowMore')[1].firstElementChild as HTMLElement;
    if (!btn) {
        console.log("❌ No se encontró el botón dentro del contenedor.");
        return null;
    }
    while (btn.hasAttribute('disabled')) {
        console.log("⌛ Botón deshabilitado, esperando...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundo
    }
    btn.click();
    console.log("✅ Botón habilitado, haciendo clic...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    return btn;
};

const loadTotalItems = async () => {
    let btn = await buttonShowMore();
    if (btn) {
        scrollToBottom();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await loadTotalItems();
    } else {
        console.log("🛒 Todos los items cargados");
    }
};

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(async ({ cmd }) => {
        console.log("📩 Comando recibido:", cmd)
        try {
            await loadTotalItems();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Espera extra para asegurar carga
            const data = getItems();
            console.log("🛒 Datos obtenidos despues de cargar los productos:", data);
            port.postMessage({ success: true, message: "Items obtenidos", data });
        } catch (error) { }


    })
})
