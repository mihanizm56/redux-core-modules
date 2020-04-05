const path = require('path');
const mkdir = require('mkdirp-promise');
const { access, readdir, readFile, writeFile, stat } = require('./fs-promises');

class Copier {
  constructor({ arrayToCopy }) {
    this.arrayToCopy = arrayToCopy;
  }

  init() {
    const arrayOfPromises = this.arrayToCopy.map(pathsPair =>
      this.copyMethod(pathsPair),); // eslint-disable-line

    Promise.all(arrayOfPromises).then(() => console.log('copied'));  // eslint-disable-line
  }

  copyMethod({ from, to }) {
    return access(from)
      .then(() =>
        mkdir(to)
          .then(() => this.copyPaste(from, to))
          .catch(error => console.log('error', error)),)// eslint-disable-line
      .catch(error => console.log('get error in to path, made new one', error));// eslint-disable-line
  }

  copyPaste(from, to) {
    readdir(from).then(files => {
      files.forEach(file => {
        const pathToCopyFile = path.join(from, file);
        const pathToPasteFile = path.join(to, file);

        stat(pathToCopyFile).then(fileStat => {
          if (fileStat.isDirectory()) {
            const pathToDir = path.join(to, file);
            return access(pathToDir)
              .then(() => this.copyPaste(pathToCopyFile, pathToDir))
              .catch(() => mkdir(pathToDir))
              .then(() => this.copyPaste(pathToCopyFile, pathToDir));
          }
          return readFile(pathToCopyFile).then(content =>
            writeFile(pathToPasteFile, content),);// eslint-disable-line
        });
      });
    });
  }
}

module.exports.Copier = Copier;
