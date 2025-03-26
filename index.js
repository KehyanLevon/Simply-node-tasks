const { Readable, Writable, Transform } = require('stream');
const { format } = require('date-fns');
const fs = require('fs');

class TimeSource extends Readable {
  constructor(options = {}) {
    super(options);
    this._interval = null;
  }

  _read() {
    if (!this._interval) {
      this._interval = setInterval(() => {
        this.push(new Date().toISOString());
      }, 1000);
    }
  }

  _destroy(err, callback) {
    if (this._interval) {
      clearInterval(this._interval);
    }
    super._destroy(err, callback);
  }
}

class TimeFormatter extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(format(chunk, 'yyyy-MM-dd HH:mm:ss') + '\n');
    callback();
  }
}

class FileWriter extends Writable {
  constructor(filePath, options = {}) {
    super(options);
    this._fileStream = fs.createWriteStream(filePath, { flags: 'a' });
  }

  _write(chunk, encoding, callback) {
    this._fileStream.write(chunk, encoding, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      }
      callback();
    });
  }
}

const timeSource = new TimeSource();
const timeFormatter = new TimeFormatter();
const fileWriter = new FileWriter('time-log.txt');

timeSource
  .pipe(timeFormatter)
  .pipe(fileWriter)
  .on('error', (err) => console.error('Stream error:', err));

console.log('Time logger started. Writing to time-log.txt...');
console.log('Type Ctrl+C to exit:');

process.on('SIGINT', () => {
  console.log('\nStopping time logger...');
  timeSource.destroy();
  timeFormatter.destroy();
  fileWriter.destroy();
  console.log('\nTime logger stoped...');
  process.exit();
});