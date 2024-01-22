const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, './styles');
const outFilePath = path.join(__dirname, './project-dist/bundle.css');
const output = fs.createWriteStream(outFilePath, 'utf8');

fs.promises.readdir(fullPath).then((filePaths) => {
  filePaths.forEach((filePath) => {
    const fullFilePath = path.join(fullPath, filePath);
    fs.stat(fullFilePath, (err, stats) => {
      if (stats.isFile() && path.extname(filePath) === '.css') {
        const input = fs.createReadStream(fullFilePath, 'utf8');
        input.on('data', (data) => {
          output.write(data);
        });
      }
    });
  });
});
