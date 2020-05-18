class Logger {
  constructor() {
    this.prefix = '[youtube-stay-focused]: ';
  }

  log(...args) {
    console.log(this.prefix, ...args);
  }
}

export default Logger;
