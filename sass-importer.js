const sass = require('sass');

module.exports = {
  importer: function(url, prev, done) {
    if (this.options.functions) {
      console.warn('Legacy JS API detected in:', prev);
    }
    return null;
  }
};