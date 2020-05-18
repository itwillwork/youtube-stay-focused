export default {
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
};
