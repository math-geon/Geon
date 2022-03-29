const fs = require('fs');
const path = require('path');

module.exports = {
  env: {
    assets: fs.readdirSync(path.resolve(__dirname, 'public', 'assets')),
  },
};
