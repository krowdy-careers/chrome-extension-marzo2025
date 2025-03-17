import {load_complete} from './helperFunctions'

const getItems = ()=>{
    const data = [...document.querySelectorAll('.vtex-product-summary-2-x-productBrand')].
    map(el=> {return (el as HTMLElement )?.innerText})
    return data
}
 export type Category={
    name:string,
    origen:string,
    priceCard:string,
    priceOnline:string,
    priceRegular:string,
    discount:string,
   image?:string
}
export  type DataWong={
    category:string |null,
    listProducts?:Category[]
}
const getAllCategoryData = async() => {


     ///await load_complete();
    let category = "a.vtex-breadcrumb-1-x-link.vtex-breadcrumb-1-x-link--1.dib.pv1.link.ph2.c-muted-2.hover-c-link";
    
  
  
    let gallery_content = document.getElementById("gallery-layout-container")
    let category_name=document.querySelector(category);
    const data:DataWong={
        category:category_name?.textContent??"none",
    }

    if(!gallery_content){
        console.log("no found galery of products");
        return data;
    }
   

    //article.vtex-product-summary-2-x-element.pointer.pt3.pb4.flex.flex-column.h-100
   let result;
  
    if(gallery_content){
      ///let list_cards =[...gallery_content?.childNodes]

      const articles: HTMLElement[] = []; // Array para almacenar los elementos article

      gallery_content.childNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const article = node.querySelector("article.vtex-product-summary-2-x-element.pointer.pt3.pb4.flex.flex-column.h-100");
          if (article) {
            articles.push(article as HTMLElement); // Agrega el article al array
          }
        }
      });
      result= articles.map((card)=>{
         let name  = card?.children[2]?.textContent??"none";
         let origen= card?.children[3]?.textContent??"marte";
         let priceCencosud=card?.children[6]?.textContent?? "none";
         let priceOnline =card?.children[7]?.children[0]?.children[0]?.children[0]?.children[0]?.textContent??"none";
         let priceRegular=card?.children[7]?.children[0]?.children[0]?.children[0]?.children[1]?.textContent?? "none";
         let des=card?.children[0]?.textContent??"none";
         let image=card?.children[0]?.children[0]?.children[0]?.children[1]?.children[0]?.children[0]?.textContent?? "none";

        return {name:name, origen:origen,priceCard:priceCencosud,priceOnline:priceOnline,priceRegular:priceRegular,discount:des,image:image}
      })
      /*// Formatear el resultado para addRow
      data.listProducts = result?.map(item => ({
        description: `Nombre: ${item.name}, Origen: ${item.origen}, Precio Card: ${item.priceCard}, Precio Online: ${item.priceOnline}, Precio Regular: ${item.priceRegular}, Descuento: ${item.discount}, Imagen: ${item.image}`
      })) || [{description: "no se obtuvo porque es null"}];
       */
      data.listProducts=result;
    }
 
   
    
      return data; // Retornar solo listProducts
    
    

  //return data;
  }
  
export {getItems,getAllCategoryData}