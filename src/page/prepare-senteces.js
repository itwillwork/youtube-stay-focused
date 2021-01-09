import porterStemmerRu from 'natural/lib/natural/stemmers/porter_stemmer_ru';
import porterStemmer from 'natural/lib/natural/stemmers/porter_stemmer';

import stopWords from './stop-words';

const URL_REG_EXP = /(https?|chrome):\/\/[^\s$.?#].[^\s]*/gm;
const DOUBLE_SPACE_REG_EXP = /\s+/g;
const SPACE = ' ';
const EMPTY = '';
const clear = sentence =>
  sentence
    .replace(DOUBLE_SPACE_REG_EXP, SPACE)
    .replace(URL_REG_EXP, EMPTY)
    .toLowerCase();

const WORD_REG_EXP = /[^A-Za-zА-Яа-я0-9_]+/gim;
const tokenize = sentence =>
  sentence.split(' ').map(word => word.replace(WORD_REG_EXP, ''));

const stem = words =>
  words
    .map(word => porterStemmerRu.stem(word))
    .map(word => porterStemmer.stem(word));

const NUMBER_REG_EXP = /^\d+$/;
const MINIMAL_WORLD_LENGTH = 3;

const filterMeaningfulWords = words => {
  return words
    .filter(word => !NUMBER_REG_EXP.test(word))
    .filter(word => word.length >= MINIMAL_WORLD_LENGTH)
    .filter(word => !stopWords[word]);
};

export default sentences =>
  sentences
    .map(clear)
    .map(tokenize)
    .map(stem)
    .map(filterMeaningfulWords);
