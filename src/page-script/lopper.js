import throttle from 'lodash/throttle';

import prepareSenteces from './prepare-senteces';

import { DEFAULT_CONFIG, STORAGE_CONFIG_KEY } from '../constants';

class Looper {
  constructor(domManipulator, classifier, logger) {
    this.domManipulator = domManipulator;
    this.classifier = classifier;
    this.logger = logger;

    this.updateConfig = this.updateConfig.bind(this);
    this.init = this.init.bind(this);
    this.loop = this.loop.bind(this);

    this.prevSourceSentences = [];
    this.prevRecommendsSentences = [];
    this.prevConfig = {};
  }

  updateConfig(callback) {
    try {
      chrome.storage.local.get([STORAGE_CONFIG_KEY]).then((result) => {
        callback({
          ...DEFAULT_CONFIG,
          ...(result[STORAGE_CONFIG_KEY] || {}),
        });
      });
    } catch (error) {
      console.warn(`updateConfig: can not get ${STORAGE_CONFIG_KEY}`);
      this.logger.error(error);
    }
  }

  loop() {
    this.logger.log('loop');
    this.updateConfig((config) => {
      const { logger, domManipulator, classifier } = this;

      if (!config['params:isActive']) {
        domManipulator.removeAllBlur();
        domManipulator.removeAllSimilarWords();
        domManipulator.removeTrendsBlur();
        domManipulator.removeMainRecommendsBlur();
        this.prevConfig = config;
        logger.log('not active!');
        return;
      }

      const isTrendsPage = document.location.pathname === '/feed/trending';
      if (
        config['options:trends'] &&
        isTrendsPage &&
        domManipulator.hasTrends()
      ) {
        domManipulator.blurTrends();
      } else {
        domManipulator.removeTrendsBlur();
      }

      const isMainPage = document.location.pathname === '/';
      if (
        config['options:main'] &&
        isMainPage &&
        domManipulator.hasMainRecommends()
      ) {
        domManipulator.blurMainRecommends();
      } else {
        domManipulator.removeMainRecommendsBlur();
      }

      const isWatchingVideoPage = document.location.pathname === '/watch';
      if (!isWatchingVideoPage) {
        this.prevConfig = config;
        logger.log('is not watching video page');
        return;
      }

      const sourceNodes = domManipulator.getSourceNodes();
      const sourceSentences = sourceNodes.map(domManipulator.getSentence);
      // const isSameSourceSentences =
      //   JSON.stringify(sourceSentences) ===
      //   JSON.stringify(this.prevSourceSentences);

      const recommendsNodes = domManipulator.getRecomendsNodes();
      const recommendsSentences = recommendsNodes.map(
        domManipulator.getRecomendSentence
      );
      // const isSameRecommendsSentences =
      //   JSON.stringify(recommendsSentences) ===
      //   JSON.stringify(this.prevRecommendsSentences);
      //
      // const isSameConfig =
      //   JSON.stringify(config) === JSON.stringify(this.prevConfig);

      // TODO debug
      // if (isSameSourceSentences && isSameRecommendsSentences && isSameConfig) {
      //   logger.log('skip! cache');
      //   return;
      // }

      logger.log('has new sourceSentences or recommendsSentences');
      this.prevSourceSentences = sourceSentences;
      this.prevRecommendsSentences = recommendsSentences;
      this.prevConfig = config;

      const preparedSourceSenteces = prepareSenteces(sourceSentences);
      const preparedRecommedsSentences = prepareSenteces(recommendsSentences);

      classifier.reset();

      preparedSourceSenteces.forEach((words) => {
        classifier.addWords(words);
      });

      const similarSentencesWords = preparedRecommedsSentences.map(
        (words, index) => {
          return classifier.getSimilarWords(words);
        }
      );

      domManipulator.removeAllBlur();
      domManipulator.removeAllSimilarWords();

      similarSentencesWords.forEach((similarWords, index) => {
        if (!similarWords.length) {
          domManipulator.addBlur(recommendsNodes[index]);
        }

        if (config['options:debug'] && similarWords.length) {
          domManipulator.showSimilarWords(recommendsNodes[index], similarWords);
        }
      });
    });
  }

  init(config) {
    this.updateConfig((config) => {
      const debouncedLoop = throttle(this.loop, config['options:coldTime']);

      setTimeout(debouncedLoop, config['options:fitstCheckInterval']);
      setTimeout(debouncedLoop, config['options:secondCheckInterval']);
      setInterval(debouncedLoop, config['options:checkInterval']);
      window.addEventListener('scroll', debouncedLoop);
    });
  }
}

export default Looper;
