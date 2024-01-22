const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'secret-folder');

fs.promises.readdir(fullPath).then((filePaths) => {
  filePaths.forEach((filePath) => {
    const fullFilePath = path.join(fullPath, filePath);
    fs.stat(fullFilePath, (err, stats) => {
      if (stats.isFile()) {
        console.log(
          `${filePath.split('.')[0]} - ${path.extname(filePath).slice(1)} - ${
            stats.size / 1024
          }kb`,
        );
      }
    });
  });
});
