// Funcion que espera a que la etiqueta span desaparesca
const waitForSpinnerToDisappear = (): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const spinner = document.querySelector(
        'span.vtex-button__spinner-container.top-0.left-0.w-100.h-100.absolute.flex.justify-center.items-center'
      );
      if (!spinner) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

const getAllNewItems = async (): Promise<string[]> => {
  const allNewItems: string[] = [];

  const captureNewElements = (): string[] => {
    return [...document.querySelectorAll('.vtex-product-summary-2-x-productBrand:not(.captured)')].map(el=> {
        const element = el as HTMLElement;
        element.classList.add('captured');
        return element.innerText;
        });
  };

  allNewItems.push(...captureNewElements());

  let btnShowMoreContainer = document.querySelector(
    'div.vtex-search-result-3-x-buttonShowMore.w-100.flex.justify-center'
  );
  
  while (btnShowMoreContainer && btnShowMoreContainer.children.length > 0) {
    const btnShowMore = btnShowMoreContainer.children[0] as HTMLElement;
    btnShowMore.click();

    await waitForSpinnerToDisappear(); // La desaparición de la etiqueta span indica que se cargo todos los datos

    const newItems = captureNewElements();
    if (newItems.length === 0) break; 

    allNewItems.push(...newItems);

    btnShowMoreContainer = document.querySelector(
      'div.vtex-search-result-3-x-buttonShowMore.w-100.flex.justify-center'
    );
  }

  return allNewItems;
};

export { getAllNewItems };
