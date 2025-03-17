import {
  getPortActiveTab,
  saveObjectInLocalStorage,
  getObjectInLocalStorage
} from './utils/helperFunctions';

chrome.runtime.onConnect.addListener(async (port) => {
  port.onMessage.addListener(async ({ cmd }) => {
    if (cmd === 'getAllItems') {
      const portTab = await getPortActiveTab();
      portTab?.postMessage({ cmd: 'getAllItems' });
      portTab?.onMessage.addListener(async ({ success, message, data }) => {
        if (!success) console.log(message);
        await saveObjectInLocalStorage({ items: data });
      });
    }
    if (cmd === 'getPopupItems') {
      const data = await getObjectInLocalStorage('items');
      port.postMessage({ success: true, message: 'Items obtenidos', data });
    }
  });
});
