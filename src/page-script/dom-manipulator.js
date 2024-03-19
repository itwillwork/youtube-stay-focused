import uniq from 'lodash/uniq';


const CSS_CLASSNAMES = {
  blur: 'youtube-stay-focused__blur',
  similarWords: 'youtube-stay-focused__similar-words',
};

const SELECTORS = {
  source: {
    title: 'ytd-watch-metadata h1',
    description: 'ytd-watch-metadata #snippet-text',
    channelName: 'ytd-watch-metadata #channel-name',
  },
  recommendations: {
    container: 'ytd-rich-item-renderer #content',
    node: {
      title: '#video-title',
      channelName: '#channel-name yt-formatted-string',
    },
  },
  trends: 'ytd-video-renderer #content',
  mainRecommends: 'ytd-rich-item-renderer #content',
  similarWords: `.${CSS_CLASSNAMES.similarWords}`,
};

const OLD_DESIGN_SELECTORS = {
  source: {
    title: 'h1',
    description: '#description',
    channelName:
        '#meta-contents a.yt-simple-endpoint.style-scope.yt-formatted-string',
  },
  recommendations: {
    container: 'ytd-compact-video-renderer',
    node: {
      title: '#video-title',
      channelName: '#channel-name yt-formatted-string',
    },
  },
  trends: 'ytd-video-renderer',
  mainRecommends: 'ytd-rich-item-renderer',
  similarWords: `.${CSS_CLASSNAMES.similarWords}`,
};

const hasValue = (value) => !!value;

class DomManipulator {
  getSourceNodes() {
    return [
      document.querySelector(SELECTORS.source.title) || document.querySelector(OLD_DESIGN_SELECTORS.source.title),
      document.querySelector(SELECTORS.source.description) || document.querySelector(OLD_DESIGN_SELECTORS.source.description),
      document.querySelector(SELECTORS.source.channelName) || document.querySelector(OLD_DESIGN_SELECTORS.source.channelName),
    ].filter(hasValue);
  }

  getNodes(selector, fallbackSelector) {
    let recomendsCollection = document.querySelectorAll(selector) || [];
    if (recomendsCollection && !recomendsCollection.length && fallbackSelector) {
      recomendsCollection = document.querySelectorAll(fallbackSelector) || [];
    }

    return Array.prototype.slice.call(recomendsCollection).filter(hasValue);
  }

  getTrendsNodes() {
    return uniq([
        ...this.getNodes(SELECTORS.trends),
        ...this.getNodes(OLD_DESIGN_SELECTORS.trends),
    ]);
  }

  hasTrends() {
    const trendsNodes = this.getTrendsNodes();

    return !!trendsNodes.length;
  }

  blurTrends() {
    const trendsNodes = this.getTrendsNodes();
    trendsNodes.forEach((node) => {
      this.addBlur(node);
    });
  }

  removeTrendsBlur() {
    const trendsNodes = this.getTrendsNodes();
    trendsNodes.forEach((node) => {
      node.classList.remove(CSS_CLASSNAMES.blur);
    });
  }

  getMainRecommendsNodes() {
    return uniq([
        ...this.getNodes(SELECTORS.mainRecommends),
        ...this.getNodes(OLD_DESIGN_SELECTORS.mainRecommends),
    ]);
  }

  hasMainRecommends() {
    const mainRecommendsNodes = this.getMainRecommendsNodes();

    return !!mainRecommendsNodes.length;
  }

  blurMainRecommends() {
    const mainRecommendsNodes = this.getMainRecommendsNodes();
    mainRecommendsNodes.forEach((node) => {
      this.addBlur(node);
    });
  }

  removeMainRecommendsBlur() {
    const mainRecommendsNodes = this.getMainRecommendsNodes();
    mainRecommendsNodes.forEach((node) => {
      node.classList.remove(CSS_CLASSNAMES.blur);
    });
  }

  getRecomendsNodes() {
    return uniq([
        ...this.getNodes(SELECTORS.recommendations.container),
        ...this.getNodes(OLD_DESIGN_SELECTORS.recommendations.container),
    ]);
  }

  getRecomendSentence(node) {
    const titleNode = node.querySelector(SELECTORS.recommendations.node.title) || node.querySelector(OLD_DESIGN_SELECTORS.recommendations.node.title);
    const channelNameNode = node.querySelector(
      SELECTORS.recommendations.node.channelName
    ) || node.querySelector(
        OLD_DESIGN_SELECTORS.recommendations.node.channelName
    );

    return [
      titleNode ? titleNode.textContent : '',
      channelNameNode ? channelNameNode.textContent : '',
    ].join(' ');
  }

  addBlur(node) {
    const { classList } = node

    if (classList.contains(CSS_CLASSNAMES.blur)) {
      return
    }

    classList.add(CSS_CLASSNAMES.blur);
  }

  showSimilarWords(node, similarWords) {
    const similarWordsNode = document.createElement('div');
    similarWordsNode.classList.add(CSS_CLASSNAMES.similarWords);
    similarWordsNode.textContent = similarWords.join(', ');

    node.appendChild(similarWordsNode);
  }

  removeRecommendsNodesAllBlur() {
    const recommendsNodes = this.getRecomendsNodes();
    recommendsNodes.forEach((node) => {
      node.classList.remove(CSS_CLASSNAMES.blur);
    });
  }

  removeAllSimilarWords() {
    const similarWordsNodes = this.getNodes(SELECTORS.similarWords, OLD_DESIGN_SELECTORS.similarWords);
    similarWordsNodes.forEach((node) => {
      const { parentNode } = node;
      if (!parentNode) {
        return;
      }

      parentNode.removeChild(node);
    });
  }

  getSentence(node) {
    return node.textContent;
  }
}

export default DomManipulator;
