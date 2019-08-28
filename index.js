const { readFile, writeFile } = require('fs');
const { promisify } = require('util');
const config = require('./config');

const readFileP = promisify(readFile);
const writeFileP = promisify(writeFile);

const defaultReadFile = async (filePath) => await readFileP(filePath, "utf8");
const defaultWriteFile = async (filePath, content) => await writeFileP(filePath, content);

const defaultFilter = (word) => 
  word.trim().length > 0;

const foreachLine = async (line) => {
  let trimedLine = line.trim();
  let splitedTrimedLine = trimedLine.split(' ');
  if (splitedTrimedLine[0] === '>>part') {
    [ _, filePath ] = splitedTrimedLine;
    return await buildFile({
      filePathIn: filePath,
      filter: defaultFilter,
      foreachLine: foreachLine
    });
  } else {
    return trimedLine;
  };
};

const buildFile = async ({ filePathIn, filePathOut = false, filter, foreachLine }) => {
  try {
    let result = [];
    let fileContent = await defaultReadFile(filePathIn);
    let splitedFileContent = fileContent.split('\n').filter(filter);

    for (let index = 0; index < splitedFileContent.length; index++) {
      result.push(await foreachLine(splitedFileContent[index]));
    }

    let newFileContent = result.join('');

    /** if filePathOut is not empty, write all content into this file */
    if (filePathOut) {
      await defaultWriteFile(filePathOut, newFileContent);
    }

    return newFileContent;
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  try {
    await buildFile({
      filePathIn: config.inputFilePathWithName,
      filePathOut: config.outputFilePathWithName,
      filter: defaultFilter,
      foreachLine: foreachLine
    });

    console.log('File build is done');
  } catch (err) {
    console.log(err);
  }
})();
