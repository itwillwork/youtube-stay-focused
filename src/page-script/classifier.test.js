import Classifier from './classifier';

describe('classifier', () => {
  test('classify', () => {
    const classifier = new Classifier();
    classifier.addWords(['hello', 'world']);

    const verdict = classifier.classify(['world']);

    expect(verdict).toBe(true);
  });

  test('has similar words', () => {
    const classifier = new Classifier();
    classifier.addWords(['hello', 'world']);

    const similarWords = classifier.getSimilarWords(['world']);

    expect(similarWords.length).toBe(1);
    expect(similarWords).toEqual(['world']);
  });

  test('has not similar words', () => {
    const classifier = new Classifier();
    classifier.addWords(['hello', 'world']);

    const similarWords = classifier.getSimilarWords(['jz']);

    expect(similarWords.length).toBe(0);
    expect(similarWords).toEqual([]);
  });

  test('reset', () => {
    const classifier = new Classifier();
    classifier.addWords(['hello', 'world']);

    classifier.reset();
    const verdict = classifier.classify(['world']);

    expect(verdict).toBe(false);
  });
});
