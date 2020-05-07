class Classifier {
	constructor() {
		this.wordsMap = {};
	}

	addWords(words) {
		const wordsMap = words.reduce((wordsMap, word) => {
			return {...wordsMap, [word]: true};
		}, {});

		this.wordsMap = {
			...this.wordsMap,
			...wordsMap,
		};
	}

	classify(words) {
		return words.some(word => this.wordsMap[word]);

	}

	getSimilarWorlds(words) {
		const sameWords = words.filter(word => this.wordsMap[word]);
		if (!sameWords.length) {
			return null;
		}

		return sameWords;
	}
}

export default Classifier;