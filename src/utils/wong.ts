// https://www.wong.pe/11961?gad_source=1&gclid=Cj0KCQjw4cS-BhDGARIsABg4_J2EFhPBn01f5Ij2Q3bXVXNrjiotcGmlAjuZAkHEXwji9KgFmvxQZIkaAhSnEALw_wcB&initialMap=productClusterIds&initialQuery=11961&map=category-2,productclusternames&query=/gaseosas/todo-supermercado&searchState
// Categoria: gaseosas

export const getItems = () => {
  const cssContainerData = ".vtex-product-summary-2-x-element";
  const cssProductName = ".vtex-product-summary-2-x-productBrand";
  const cssPriceInteger = ".vtex-product-price-1-x-currencyInteger";
  const cssPriceFraction = ".vtex-product-price-1-x-currencyFraction";

  const data = [...document.querySelectorAll(cssContainerData)].map((el) => {
    const productName = el.querySelector(cssProductName)?.textContent;
    const priceInteger = el.querySelector(cssPriceInteger)?.textContent;
    const priceFraction = el.querySelector(cssPriceFraction)?.textContent;

    const totalPrice = (
      Number(priceInteger) +
      Number(priceFraction) / 100
    ).toFixed(2);

    return { productName, totalPrice };
  });
  return data;
};

