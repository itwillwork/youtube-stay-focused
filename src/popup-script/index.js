import { DEFAULT_CONFIG, STORAGE_CONFIG_KEY } from '../constants';

const WARNING_TTL = 5 * 1000;
let warningTimeoutId = null;
const showWarning = () => {
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

const removeLoader = () => {
  const loaderNode = document.querySelector('.loader');
  if (!loaderNode) {
    return;
  }

  const { parentNode } = loaderNode;
  if (!parentNode) {
    return;
  }

  parentNode.removeChild(loaderNode);
};

const inputInitialize = (config) => {
  const inputNodesCollection = document.getElementsByTagName('input');
  const inputNodes = Array.prototype.slice.call(inputNodesCollection);

  inputNodes.forEach((node) => {
    const { name } = node;

    node.checked = !!config[name];

    node.addEventListener('change', changeParams);
  });
};

const OPTIONS_OPACITY = {
  ENABLED: 1,
  DISABLED: 0.2,
};
const toggleOptions = (isActive) => {
  const optionsNode = document.querySelector('.options');

  if (!optionsNode) {
    return;
  }

  const opacity = isActive ? OPTIONS_OPACITY.ENABLED : OPTIONS_OPACITY.DISABLED;
  optionsNode.style.opacity = opacity;
};

const changeParams = async (event) => {
  const { name, checked } = event.target;

  if (name === 'params:isActive') {
    toggleOptions(checked);
  }

  let storageResult;
  try {
    storageResult = await chrome.storage.local.get([STORAGE_CONFIG_KEY]);
  } catch (error) {
    console.warn(`changeParams: Can not get ${STORAGE_CONFIG_KEY}`);
    console.error(error);
  }

  const config = (storageResult && storageResult[STORAGE_CONFIG_KEY]) || {};

  const newConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    [name]: checked,
  };

  try {
    await chrome.storage.local.set({[STORAGE_CONFIG_KEY]: newConfig});
  } catch (error) {
    console.warn(`changeParams: Can not set ${STORAGE_CONFIG_KEY}`);
    console.error(error);
  }

  showWarning();
};

const init = async () => {
  let storageResult;
  try {
    storageResult = await chrome.storage.local.get([STORAGE_CONFIG_KEY]);
  } catch (error) {
    console.warn(`init: Can not get ${STORAGE_CONFIG_KEY}`);
    console.error(error);
  }

  const config = (storageResult && storageResult[STORAGE_CONFIG_KEY]) || DEFAULT_CONFIG;

  inputInitialize(config);

  toggleOptions(config['params:isActive']);

  removeLoader();
};

init();
