import Logger from './logger';
import Classifier from './classifier';
import prepareSenteces from './prepare-senteces';
import throttle from 'lodash/throttle';
import selectors from './selectors';

const DEBUG = false;

const BLUR_CLASS = 'youtube-stay-focused__blur';
const COLD_TIME = 600;
const CHECK_INTERVAL = 1000;

const hasValue = (value) => !!value;

const getSourceNodes = () => {
  return [
    document.querySelector(selectors.source.title),
    document.querySelector(selectors.source.description),
    // document.querySelector(selectors.source.channelName),
  ].filter(hasValue);
};

const getRecomendsNodes = () => {
  const recomendsCollection = document.querySelectorAll(
    selectors.recommendations.container
  );

  return Array.prototype.slice.call(recomendsCollection).filter(hasValue);
};

const getRecomendSentence = (node) => {
  const titleNode = node.querySelector(selectors.recommendations.node.title);
  const channelNameNode = node.querySelector(
    selectors.recommendations.node.channelName
  );

  return [
    titleNode ? titleNode.textContent : '',
    channelNameNode ? channelNameNode.textContent : '',
  ].join(' ');
};

const addBlur = (node) => {
  node.classList.add(BLUR_CLASS);
};

const removeBlur = () => {
  const recommendsNodes = getRecomendsNodes();
  recommendsNodes.forEach((node) => {
    node.classList.remove(BLUR_CLASS);
  });
};

const getSentence = (node) => node.textContent;

const logger = new Logger();

let prevSourceSentences = [];
let prevRecommendsSentences = [];

const hideRecommends = () => {
  const isAvailableUrl = document.location.href.includes('/watch');
  if (!isAvailableUrl) {
    return;
  }

  const sourceNodes = getSourceNodes();
  const sourceSentences = sourceNodes.map(getSentence);
  if (DEBUG) {
    logger.log('sourceSentences', sourceSentences);
  }
  const isSameSourceSentences =
    JSON.stringify(sourceSentences) === JSON.stringify(prevSourceSentences);

  const recommendsNodes = getRecomendsNodes();
  const recommendsSentences = recommendsNodes.map(getRecomendSentence);
  if (DEBUG) {
    logger.log('recommendsSentences', recommendsSentences);
  }
  const isSameRecommendsSentences =
    JSON.stringify(recommendsSentences) ===
    JSON.stringify(prevRecommendsSentences);

  if (isSameSourceSentences && isSameRecommendsSentences) {
    logger.log('skip');
    return;
  }

  logger.log('has new sourceSentences or recommendsSentences');

  prevSourceSentences = sourceSentences;
  prevRecommendsSentences = recommendsSentences;

  const preparedSourceSenteces = prepareSenteces(sourceSentences);
  const preparedRecommedsSentences = prepareSenteces(recommendsSentences);

  const classifier = new Classifier();

  preparedSourceSenteces.forEach((words) => {
    classifier.addWords(words);
  });

  const results = preparedRecommedsSentences.map((words, index) => {
    if (DEBUG && classifier.classify(words)) {
      logger.log('similarWorlds', classifier.getSimilarWorlds(words));
    }

    return classifier.classify(words);
  });

  removeBlur();
  results.forEach((result, index) => {
    if (!result) {
      addBlur(recommendsNodes[index]);
    }
  });
};

const debouncedHideRecommends = throttle(hideRecommends, COLD_TIME);

debouncedHideRecommends();
setInterval(debouncedHideRecommends, CHECK_INTERVAL);
window.addEventListener('scroll', debouncedHideRecommends);
