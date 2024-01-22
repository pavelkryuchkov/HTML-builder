const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const fullPath = path.join(__dirname, './text.txt');
const output = fs.createWriteStream(fullPath, 'utf8');

console.log('Write something:');

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
    return;
  }
  output.write(line);
  output.write('\n');
});

process.on('exit', () => {
  console.log('Goodbye!');
});
