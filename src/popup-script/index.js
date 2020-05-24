import { DEFAULT_CONFIG, STORAGE_CONFIG_KEY } from '../constants';

const OPTIONS_OPACITY = {
  ENABLED: 1,
  DISABLED: 0.2,
};

const WARNING_TTL = 5 * 1000;

let warningTimeoutId = null;

const changeParams = (event) => {
  const { name, checked } = event.target;

  const optionsNode = document.querySelector('.options');
  if (name === 'params:isActive' && optionsNode) {
    optionsNode.style.opacity = checked
      ? OPTIONS_OPACITY.ENABLED
      : OPTIONS_OPACITY.DISABLED;
  }

  chrome.storage.local.get([STORAGE_CONFIG_KEY], (storageResult) => {
    const config = storageResult[STORAGE_CONFIG_KEY] || {};

    const newConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      [name]: checked,
    };

    chrome.storage.local.set({ [STORAGE_CONFIG_KEY]: newConfig }, function () {
      // nothing
    });
  });

  if (warningTimeoutId) {
    clearTimeout(warningTimeoutId);
  }

  const warningNode = document.querySelector('.warning');
  if (warningNode) {
    warningNode.style.display = 'block';
    warningTimeoutId = setTimeout(() => {
      warningNode.style.display = 'none';
    }, WARNING_TTL);
  }
};

const init = () => {
  chrome.storage.local.get([STORAGE_CONFIG_KEY], (storageResult) => {
    const config = storageResult[STORAGE_CONFIG_KEY] || DEFAULT_CONFIG;

    const inputNodesCollection = document.getElementsByTagName('input');
    const inputNodes = Array.prototype.slice.call(inputNodesCollection);

    inputNodes.forEach((node) => {
      const { name } = node;

      node.checked = !!config[name];

      node.addEventListener('change', changeParams);
    });

    const optionsNode = document.querySelector('.options');
    optionsNode.style.opacity = config['params:isActive']
      ? OPTIONS_OPACITY.ENABLED
      : OPTIONS_OPACITY.DISABLED;
  });
};

init();
