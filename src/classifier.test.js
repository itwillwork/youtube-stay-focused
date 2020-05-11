import Classifier from './classifier';

describe('classifier', () => {
  test('regular case', () => {
    const classifier = new Classifier();
    classifier.addWords(['hello', 'world']);

    const verdict = classifier.classify(['world']);
    expect(verdict).toBe(true);

    const similarWorlds = classifier.getSimilarWorlds(['world']);
    expect(similarWorlds.length).toBe(1);
    expect(similarWorlds).toEqual(['world']);
  });
});
