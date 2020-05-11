import Classifier from './classifier';
import prepareSenteces from './prepare-senteces';
import debounce from 'lodash/debounce';

const hasValue = value => !!value;

const getSourceNodes = () => {
  return [
    document.querySelector("h1"), // title
    document.querySelector("#description"), // description
    // document.querySelector("#meta-contents a.yt-simple-endpoint.style-scope.yt-formatted-string"), // channel name
  ].filter(hasValue);
}

const getRecomendsNodes = () => {
  const recomendsCollection = document.querySelectorAll('ytd-compact-video-renderer');

  return Array.prototype.slice.call(recomendsCollection).filter(hasValue);
}

const addBlur = (node) => {
  node.classList.add("youtube-stay-focused__blur");
}

const removeBlur = () => {
  const recommendsNodes = getRecomendsNodes();
  recommendsNodes.forEach(node => {
        node.classList.remove("youtube-stay-focused__blur");
  });
}

const getSentence = node => node.textContent;

let prevSourceSentences = [];
let prevRecommendsSentences = [];

const hideRecommends = () => {
  const isAvailableUrl = document.location.href.includes("/watch");
  if (!isAvailableUrl) {
    return;
  }
  
  console.log("youtube-stay-focused: hide recommends");

  const sourceNodes = getSourceNodes();
  const sourceSentences = sourceNodes.map(getSentence);
  const isSameSourceSentences = JSON.stringify(sourceSentences) === JSON.stringify(prevSourceSentences);
  
  const recommendsNodes = getRecomendsNodes();
  const recommendsSentences = recommendsNodes.map(getSentence);
  const isSameRecommendsSentences = JSON.stringify(recommendsSentences) === JSON.stringify(prevRecommendsSentences);

  if (isSameSourceSentences && isSameRecommendsSentences) {
    return;
  }
  
  console.log("youtube-stay-focused: has new sourceSentences or recommendsSentences");
  
  prevSourceSentences = sourceSentences;
  prevRecommendsSentences = recommendsSentences;

  const preparedSourceSenteces = prepareSenteces(sourceSentences);
  const preparedRecommedsSentences = prepareSenteces(recommendsSentences);

  const classifier = new Classifier();

  preparedSourceSenteces.forEach(words => {
    classifier.addWords(words);
  });

  const results = preparedRecommedsSentences.map((words, index) => {
    return classifier.classify(words);
  });

  removeBlur();
  results.forEach((result, index) => {
    if (!result) {
      addBlur(recommendsNodes[index])
    }
  });
}

const debouncedHideRecommends = debounce(hideRecommends, 1000, { 'maxWait': 1000 });

debouncedHideRecommends();
setInterval(debouncedHideRecommends, 3000);
window.addEventListener('scroll', debouncedHideRecommends);
