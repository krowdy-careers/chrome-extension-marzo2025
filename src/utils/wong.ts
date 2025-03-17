import { sleep } from './helperFunctions';

const getItems = () => {
  const data = [
    ...document.querySelectorAll('.vtex-product-summary-2-x-productBrand')
  ].map((item) => {
    return (item as HTMLElement)?.innerText;
  });
  return data;
};

const getAllItems = async () => {
  const selector =
    '.vtex-search-result-3-x-buttonShowMore.w-100.flex.justify-center > button > div';

  const scrollTo = '.vtex-search-result-3-x-showingProducts';

  async function waitLoadingIndicator(selector: string) {
    while (!document.querySelector(selector)) {
      await sleep(1);
    }
  }

  let loadingIndicator = document.querySelector(selector);
  while (loadingIndicator) {
    const btnShowMore = loadingIndicator.parentNode as HTMLButtonElement | null;

    if (btnShowMore) {
      document
        .querySelector(scrollTo)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(2);
      btnShowMore.click();
    }

    await waitLoadingIndicator(selector);
    loadingIndicator = document.querySelector(selector);
  }

  const data = getItems();
  return data;
};

export { getItems, getAllItems };
