const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, './text.txt');
const input = fs.createReadStream(fullPath, 'utf8');

input.on('data', (data) => {
  console.log(data);
});
