const parse = require('csv-parse');
const fs = require('fs');
const utils = require('./utils.js');

const alphabet=String.fromCharCode(...Array(91).keys()).slice(65)
const filePath =  process.argv[2] || "input.csv" || "input.tsv"
// const filePath = 'input.csv'
// const filePath = 'input.tsv'

const fileExtension = filePath.split(".")[filePath.split(".").length-1]
const delimiter = fileExtension === "csv" ? { delimiter: ',' } : { delimiter: '	' } 

let i = 0
let dict = {}
let results = []

fs.createReadStream(filePath)
  .pipe(parse(delimiter))
  .on('data', (row) => {
    if(!i) {
        // first row
        row.forEach((r, j) => {
            dict[alphabet[j]] = parseInt(r)
        })
    } else {
        results[i-1] = []
        row.forEach((r, j) => {
            let valueExpression = utils.insertValue(dict, r)
            let rpn = utils.infixToRPN(valueExpression)
            results[i-1][j] = utils.reversePolishEvaluate(rpn.slice(0, -1))
        })
    }
    i++
  })
  .on('end',function() {
    let data = "";
    Object.values(dict).forEach(v => data += v + delimiter.delimiter)
    data = data.slice(0, - delimiter.delimiter.length) + '\r\n' // remove last delimiter and lineBreak
    results.forEach(row => {
        row.forEach(r => data += r + delimiter.delimiter)   
        data = data.slice(0, - delimiter.delimiter.length) + '\r\n' // remove last delimiter and lineBreak
    })
    fs.writeFile('output.' + fileExtension, data, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('Done!');
        }
      });
  })