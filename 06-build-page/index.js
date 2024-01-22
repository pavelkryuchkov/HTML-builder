const fs = require('fs');
const path = require('path');

const outputFolder = path.join(__dirname, './project-dist');

fs.rm(outputFolder, { recursive: true, force: true }, (err) => {
  if (err !== null) console.log(err);
  fs.mkdir(outputFolder, { recursive: true }, (err) => {
    if (err !== null) console.log(err);
    createHTML();
    copyDir(
      path.join(__dirname, './assets'),
      path.join(outputFolder, './assets'),
    );
    mergeStyles();
  });
});

async function getComponents() {
  const components = await fs.promises
    .readdir(path.join(__dirname, './components'))
    .then((filePaths) => {
      // const res = {};
      const res = Promise.all(
        filePaths.map((filePath) =>
          Promise.all([
            filePath.split('.')[0],
            fs.promises.readFile(
              path.join(__dirname, './components', filePath),
            ),
          ]),
        ),
      );
      return res;
    });
  const res = {};
  components.forEach(([key, value]) => {
    res[key] = value;
  });
  return res;
}

function createHTML() {
  const inputFilePath = path.join(__dirname, './template.html');
  const outFilePath = path.join(outputFolder, './index.html');
  const input = fs.createReadStream(inputFilePath);
  const output = fs.createWriteStream(outFilePath, 'utf8');

  let resHTML = '';

  input.on('data', (data) => {
    resHTML += data;
  });

  input.on('end', async () => {
    const components = await getComponents();
    resHTML = resHTML.replace(/{{\s*(\w+)\s*}}/g, (_, componentName) => {
      return components[componentName];
    });
    output.write(resHTML);
  });
}

function mergeStyles() {
  const folderPath = path.join(__dirname, './styles');
  const outFilePath = path.join(outputFolder, './style.css');
  const output = fs.createWriteStream(outFilePath, 'utf8');

  fs.promises.readdir(folderPath).then((filePaths) => {
    filePaths.forEach((filePath) => {
      const fullFilePath = path.join(folderPath, filePath);
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
}

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
