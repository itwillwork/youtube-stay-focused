class Classifier {
  constructor() {
    this.wordsMap = {};
  }

  addWords(words) {
    const wordsMap = words.reduce((wordsMap, word) => {
      return { ...wordsMap, [word]: true };
    }, {});

    this.wordsMap = {
      ...this.wordsMap,
      ...wordsMap,
    };
  }

  classify(words) {
    return words.some(word => this.wordsMap[word]);
  }

  reset() {
    this.wordsMap = {};
  }

  getSimilarWords(words) {
    return words.filter(word => this.wordsMap[word]);
  }
}

export default Classifier;
