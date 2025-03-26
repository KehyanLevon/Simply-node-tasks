const fs = require('fs');

const directoryPath = process.argv[2] || process.cwd();
console.log(process.cwd())
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        process.exit(1);
    }

    const publicFiles = [];
    const hiddenFiles = [];

    files.forEach(file => {
        if (file.startsWith('.')) {
            hiddenFiles.push(file);
        } else {
            publicFiles.push(file);
        }
    });

    console.log(`Public Files: ${publicFiles.join(', ')}`);
    console.log(`Hidden Files: ${hiddenFiles.join(', ')}`);
});