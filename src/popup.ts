import { getPortActiveTab } from './utils/helperFunctions';

const btnScrapingTab = document.getElementById('btn-scraping-tab');
const btnScrapingBg = document.getElementById('btn-scraping-background');
const btnScrapingData = document.getElementById('btn-scraping-data');

function addRow({ description }: { description: string }) {
  const tableBody = document.getElementById('tableBody');
  const newRow = document.createElement('tr');

  const descCell = document.createElement('td');
  descCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
  descCell.textContent = description;

  newRow.appendChild(descCell);
  tableBody?.appendChild(newRow);
}

function addCount(description: string[]) {
  const resultText = document.getElementById('h2-results');
  if (resultText) {
    resultText.textContent = `Resultados: ${description.length}`;
  }
}

if (btnScrapingBg) {
  btnScrapingBg.addEventListener('click', async () => {
    const portBackground = chrome.runtime.connect({ name: 'background' });
    portBackground.postMessage({ cmd: 'getAllItems' });
  });
}

if (btnScrapingData) {
  btnScrapingData.addEventListener('click', async () => {
    const portBackground = chrome.runtime.connect({ name: 'background' });
    portBackground?.onMessage.addListener(
      async ({ success, data }: { success: boolean; data: any }) => {
        if (!success) return;
        addCount(data);
        data.items.forEach((element: string) => {
          addRow({ description: element });
        });
      }
    );
    portBackground.postMessage({ cmd: 'getPopupItems' });
  });
}

if (btnScrapingTab) {
  btnScrapingTab.addEventListener('click', async () => {
    const portTab = await getPortActiveTab();
    portTab?.onMessage.addListener(
      async ({ success, data }: { success: boolean; data: any }) => {
        if (!success) return;
        addCount(data);
        data.forEach((element: string) => {
          addRow({ description: element });
        });
      }
    );

    portTab?.postMessage({ cmd: 'getAllItems' });
  });
}
