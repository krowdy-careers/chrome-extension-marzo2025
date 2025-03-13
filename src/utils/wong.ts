const getItems = ()=>{
    const data = [...document.querySelectorAll('.vtex-product-summary-2-x-productBrand')].map(el=> {return (el as HTMLElement )?.innerText})
    return data
}

export {getItems}