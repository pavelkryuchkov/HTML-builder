const fs = require('fs');
const path = require('path');

const folderFullPath = path.join(__dirname, 'files');
const newFolderFullPath = path.join(__dirname, 'files-copy');

function copyDir(from, to) {
  fs.rm(to, { recursive: true, force: true }, (err) => {
    if (err !== null) console.log(err);
    fs.mkdir(to, { recursive: true }, (err) => {
      if (err !== null) console.log(err);
      fs.promises.readdir(from).then((filePaths) => {
        filePaths.forEach((filePath) => {
          const fullFilePath = path.join(from, filePath);
          const newFilePath = path.join(to, filePath);
          fs.stat(fullFilePath, (err, stats) => {
            if (err) console.log(err);
            if (stats.isFile()) {
              fs.copyFile(fullFilePath, newFilePath, (err) => {
                if (err !== null) console.log(err);
              });
            } else {
              copyDir(fullFilePath, newFilePath);
            }
          });
        });
      });
    });
  });
}

copyDir(folderFullPath, newFolderFullPath);
