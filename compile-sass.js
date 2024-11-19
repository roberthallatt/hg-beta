const sass = require('sass');
const fs = require('fs');
const path = require('path');

const result = sass.compile(path.resolve(__dirname, 'src/assets/scss/test.scss'), {
  quietDeps: true,
});

fs.writeFileSync(path.resolve(__dirname, 'dist/test.css'), result.css);