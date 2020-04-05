const { access, readFile, stat, writeFile, readdir } = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

module.exports.readFile = promisify(readFile);
module.exports.writeFile = promisify(writeFile);
module.exports.stat = promisify(stat);
module.exports.exec = promisify(exec);
module.exports.access = promisify(access);
module.exports.readdir = promisify(readdir);
