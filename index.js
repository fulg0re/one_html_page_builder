const {
  readFile,
  writeFile,
  createReadStream } = require('fs');
const { promisify } = require('util');
const { createInterface } = require('readline');
const config = require('./config');
const outstream = new (require('stream'))();

const writeFileP = promisify(writeFile);

const readFileLineByLine = (filePath) => new Promise((res, rej) =>{
  const instream = createReadStream(filePath);
  const rl = createInterface(instream, outstream);
  let result = [];

  console.log(`reading file (${filePath})...`);

  rl.on('line', (line) => {
    result.push(line.trim());
  });
  
  rl.on('close', function (line) {
    res(result);
    console.log(`done reading file (${filePath})...`);
  });
});

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
    let fileContent = await readFileLineByLine(filePathIn);
    let splitedFileContent = fileContent.filter(filter);

    for (let index = 0; index < splitedFileContent.length; index++) {
      result.push(await foreachLine(splitedFileContent[index]));
    }

    let newFileContent = result.join((config.minifyOutputFile) ? '' : '\n');

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
