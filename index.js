const fs = require('fs');
const { Transform } = require('stream');

class UppercaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}

const readableStream = fs.createReadStream('./static/input.txt');
const writableStream = fs.createWriteStream('./static/output.txt');
const uppercaseTransform = new UppercaseTransform();

readableStream
    .pipe(uppercaseTransform)
    .pipe(writableStream)
    .on('finish', () => {
        console.log('File processing complete. Check output.txt');
    });