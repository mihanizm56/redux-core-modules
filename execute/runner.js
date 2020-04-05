#!/usr/bin/env node

const path = require('path');
const { Copier } = require('./copier.js');
const { exec } = require('./fs-promises');

const fromFolder = path.join(
  process.cwd(),
  'node_modules',
  '@mihanizm56/redux-core-modules',
  'execute',
);

const toFolder = path.join(process.cwd(), 'execute');

const arrayToCopy = [{ from: fromFolder, to: toFolder }];

const copierStatic = new Copier({ arrayToCopy });

const runPackage = async () => {
  try {
    await exec('npm i @mihanizm56/redux-core-modules');
    copierStatic.init();
  } catch (error) {
    console.log('error when executing the package', error); // eslint-disable-line
  }
};

runPackage();
