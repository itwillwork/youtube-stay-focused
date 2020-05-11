const porterStemmerRu = require('natural/lib/natural/stemmers/porter_stemmer_ru');
const porterStemmer = require('natural/lib/natural/stemmers/porter_stemmer');

const URL_REG_EXP = /(https?|chrome):\/\/[^\s$.?#].[^\s]*/gm;
const clear = (sentence) => sentence.replace(URL_REG_EXP, '').toLowerCase();

const WORD_REG_EXP = /[^A-Za-zА-Яа-я0-9_]+/gim;
const tokenize = (sentence) =>
  sentence.split(' ').map((word) => word.replace(WORD_REG_EXP, ''));

const stem = (words) =>
  words
    .map((word) => porterStemmerRu.stem(word))
    .map((word) => porterStemmer.stem(word));

const NUMBER_REG_EXP = /^\d+$/;
const MINIMAL_WORLD_LENGTH = 3;

const STOP_WORDS = {
  // common
  the: true,

  // youtube
  recommend: true,
  for: true,
  you: true,
  topic: true,
  youtub: true,

  // movies
  trailer: true,
  
  // music
  offici: true,
  music: true,
  video: true,
  audio: true,
  prod: true,
  feat: true,
  dir: true,
};

const filterMeaningfulWords = (words) => {
  return words
    .filter((word) => !NUMBER_REG_EXP.test(word))
    .filter((word) => word.length >= MINIMAL_WORLD_LENGTH)
    .filter((word) => !STOP_WORDS[word]);
};

export default (sentences) =>
  sentences.map(clear).map(tokenize).map(stem).map(filterMeaningfulWords);
