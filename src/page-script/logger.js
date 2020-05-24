const DEBUG = false;

class Logger {
  constructor() {
    this.prefix = '[youtube-stay-focused]: ';
  }

  log(...args) {
    if (!DEBUG) {
      return;
    }

    console.log(this.prefix, ...args);
  }

  error(...args) {
    console.log(this.prefix, 'error');
    console.error(...args);
  }
}

export default Logger;
