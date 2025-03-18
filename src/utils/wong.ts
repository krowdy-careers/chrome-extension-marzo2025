const getItems = ()=>{
    let data = [...document.querySelectorAll('#gallery-layout-container .vtex-product-summary-2-x-productBrand')].map(el=> {return (el as HTMLElement )?.innerText})
    return data
}

export {getItems}