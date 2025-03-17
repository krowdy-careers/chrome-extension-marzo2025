import { getAllItems } from './utils/wong';

console.log('Estoy en contentScript 2.0');

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async ({ cmd }) => {
    console.log(cmd);
    if (cmd == 'getAllItems') {
      const data = await getAllItems();
      port.postMessage({ success: true, message: 'Items obtenidos', data });
    }
  });
});
