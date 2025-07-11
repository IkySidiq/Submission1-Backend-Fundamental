const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  async writeFile(file, meta) {
    const extension = path.extname(meta.filename);
    const filename = `cover-${nanoid(16)}${extension}`;
    const fullPath = path.join(this._folder, filename);

    const writeStream = fs.createWriteStream(fullPath);

    return new Promise((resolve, reject) => {
      file.pipe(writeStream);

      file.on('end', () => {
        resolve(filename);
      });

      file.on('error', (error) => {
        reject(error);
      });
    });
  }
}

module.exports = StorageService;
