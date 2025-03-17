
//  https://www.metro.pe/vinos?map=ft&page=3
// estoy usando otra web para hacer pruebas, ya que la web de wong es muy lenta y no me permite hacer pruebas rapidas

import { sleep } from "./helperFunctions";


const getItems = async () => {
  let productContainers = Array.from(
    document.querySelectorAll('.vtex-product-summary-2-x-container')
  );

  const scrollToBottom = async () => {
    await new Promise<void>((resolve) => {
      const scrollStep = () => {
        window.scrollBy(0, window.innerHeight); 
        if (document.documentElement.scrollHeight - window.scrollY <= window.innerHeight + 100) {
          resolve(); 
        } else {
          setTimeout(scrollStep, 2000); 
        }
      };
      scrollStep();
    });
  };

  while (true) {
    const showMoreButton = document.querySelector(
      '.vtex-button__label.flex.items-center.justify-center.h-100.ph5'
    ) as HTMLElement | null;

    if (showMoreButton) {
      showMoreButton.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      showMoreButton.click();

      await new Promise<void>((resolve) => {
        const observer = new MutationObserver((mutations) => {
          const newContainers = document.querySelectorAll(
            '.vtex-product-summary-2-x-container'
          );
          if (newContainers.length > productContainers.length) {
            productContainers = Array.from(newContainers);
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });
    } else {
      await scrollToBottom();

      await new Promise<void>((resolve) => {
        const observer = new MutationObserver((mutations) => {
          const newContainers = document.querySelectorAll(
            '.vtex-product-summary-2-x-container'
          );
          if (newContainers.length > productContainers.length) {
            productContainers = Array.from(newContainers);
          } else {
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });

      break;
    }
  }

  return productContainers.map((container) => {
    const brand = container.querySelector('span.vtex-product-summary-2-x-productBrand')?.textContent?.trim() || null;
    const price = container.querySelector('.vtex-product-price-1-x-currencyContainer')?.textContent?.trim() || null;
    return { brand, price };
  });
};

  export { getItems };



  