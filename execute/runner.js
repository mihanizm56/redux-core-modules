const path = require('path');
const { Copier } = require('./copier.js');

process.exec('npm i @mihanizm56/redux-core-modules@beta');

const fromFolder = path.join(
  process.cwd(),
  'node_modules',
  '@mihanizm56/redux-core-modules',
  'file.js',
);

const toFolder = process.cwd();

const arrayToCopy = [{ from: fromFolder, to: toFolder }];

const copierStatic = new Copier({ arrayToCopy });

copierStatic.init();
