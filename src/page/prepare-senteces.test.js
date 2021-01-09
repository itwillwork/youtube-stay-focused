import prepareSenteces from './prepare-senteces';

describe('prepare sentences', () => {
  test('lower case', () => {
    const sentences = ['Hello World'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['hello', 'world']]);
  });

  test('punctuation', () => {
    const sentences = ['hello, world!? nope.'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['hello', 'world', 'nope']]);
  });

  test('other punctuation', () => {
    const sentences = [
      '# $1 — A$AP Rocky - Multiply & Boulevard Depo / Pharaoh',
    ];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([
      ['aap', 'rocki', 'multipli', 'boulevard', 'depo', 'pharaoh'],
    ]);
  });

  test('numbers', () => {
    const sentences = ['hello world part 28'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['hello', 'world', 'part']]);
  });

  test('short words', () => {
    const sentences = ['hello world no'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['hello', 'world']]);
  });

  test('many spaces', () => {
    const sentences = ['hello          \n              world'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['hello', 'world']]);
  });

  test('en stem', () => {
    const sentences = ['hello worlds loading'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['hello', 'world', 'load']]);
  });

  test('ru stem', () => {
    const sentences = ['привет загадочный и неповторимый мир'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['привет', 'загадочн', 'неповторим', 'мир']]);
  });

  test('hooks', () => {
    const sentences = [
      " ' ` \"  [( ASAP 'Rocky' \"Purple Swag\" or What's Beef )] ",
    ];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([
      ['asap', 'rocki', 'purpl', 'swag', 'what', 'beef'],
    ]);
  });

  test('links', () => {
    const sentences = [
      `
			  Follow A$AP Rocky 
			► https://soundcloud.com/asvpxrocky
			► https://www.facebook.com/asaprocky
			► https://www.youtube.com/user/LIVELOVEASAPVEVO
		`,
    ];

    const result = prepareSenteces(sentences);
    expect(result).toEqual([['follow', 'aap', 'rocki']]);
  });

  test('service words, youtube', () => {
    const sentences = ['hello Recommended for you Topic YouTube'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['hello']]);
  });

  test('service words, music', () => {
    const sentences = [
      'A$AP Rocky - Bass (Official Video)',
      'Yung Lean - Afghanistan (Prod. ZCR) ',
      'Yung Lean - Highway Patrol (Feat. bladee) (Official Music Video)',
      '21 Savage - Bank Account (Official Audio)',
      'A$AP Mob - Yamborghini High (Official Music Video) ft. Juicy J',
      'Kendrick Lamar - Backseat Freestyle (Explicit)',
      'Lil Xan - Betrayed (Dir. by @_ColeBennett_)',
      'Kill Me - Музыканты',
    ];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([
      ['aap', 'rocki', 'bass'],
      ['yung', 'lean', 'afghanistan', 'zcr'],
      ['yung', 'lean', 'highwai', 'patrol', 'blade'],
      ['savag', 'bank', 'account'],
      ['aap', 'mob', 'yamborghini', 'high', 'juici'],
      ['kendrick', 'lamar', 'backseat', 'freestyl', 'explicit'],
      ['lil', 'xan', 'betrai', '_colebennett_'],
      ['kill', 'музыкант'],
    ]);
  });

  test('service words, trailer', () => {
    const sentences = ['Scarface (Trailer #1) HD'];
    const result = prepareSenteces(sentences);
    expect(result).toEqual([['scarfac']]);
  });

  test('русские местоимения', () => {
    const sentences = [
      'я, мы, ты, вы, он, она, оно, они, себя, мой, моя, мое, мои, наш, наша, наше, наши, твой, твоя, твое, твои, ваш, ваша, ваше, ваши, его, ее, их, кто? что? какой? каков? чей? который? сколько? где? когда? куда? откуда? зачем? кто, что, какой, каков, чей, который, сколько, где, когда, куда, зачем, столько, этот, тот, такой, таков, тут, здесь, сюда, туда, оттуда, отсюда, тогда, поэтому, затем, весь, всякий, все, сам, самый, каждый, любой, другой, иной, всяческий, всюду, везде, всегда, никто, ничто, некого, нечего, никакой, ничей, некто, нечто, некий, некоторый, несколько, кое-кто, кое-где, кое-что, кое-куда, какой-либо, сколько-нибудь, куда-нибудь, зачем-нибудь, чей-либо',
    ];
    const result = prepareSenteces(sentences);
    expect(result.length).toEqual(0);
  });
});
