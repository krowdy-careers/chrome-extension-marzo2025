async function loadAllData() {
    const clickShowMoreButton = async () => {
        const showMoreButton = document.querySelector('.vtex-search-result-3-x-buttonShowMore button') as HTMLButtonElement | null;
        if (showMoreButton) {
            console.log("Clic en el boton");
            showMoreButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
            return true;
        }
        return false;
    };

    while (await clickShowMoreButton()) {}


    await scrollToBottom();

    const data = [...document.querySelectorAll('.vtex-product-summary-2-x-productBrand')].map(el => {
        return (el as HTMLElement)?.innerText;
    });

    return data;
}

async function scrollToBottom() {

    let previousHeight = document.body.scrollHeight;
    let attempts = 0;
    const maxAttempts = 5;

    const performScroll = async () => {
        window.scrollBy({ top: 1000, behavior: "smooth" });
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const observer = new MutationObserver(() => {
        previousHeight = document.body.scrollHeight;
        attempts = 0;
    });

    observer.observe(document.body, { childList: true, subtree: true });

    while (attempts < maxAttempts) {
        await performScroll();

        if (document.body.scrollHeight === previousHeight) {
            attempts++;
        } else {
            previousHeight = document.body.scrollHeight;
            attempts = 0;
        }
    }

    observer.disconnect();
    console.log("Scroll completado");
}

const getItems = async () => {
    try {
        const data = await loadAllData();
        return data;
    } catch (error) {
        console.error("Error : ", error);
        return [];
    }
};

export { getItems };