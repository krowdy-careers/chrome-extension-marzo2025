const getItems = ()=>{
    const cssItem = "div.product.details"

    const items = Array.from(document.querySelectorAll(cssItem))
    const data = items.map(item=>{ 
        const cssBrand = ".brand-label"
        const cssName = ".product-item-name"
        const name = item.querySelector(cssName)?.textContent
        const brand = item.querySelector(cssBrand)?.textContent
        return {name, brand}
    })

    console.log(data)

    return data
}


export {getItems} 