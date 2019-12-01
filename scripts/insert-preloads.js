const fs = require('fs');

const pathToHTML = './build/index.html';
if (!fs.existsSync(pathToHTML)) {
  throw new Error("index.html file doesn't exist");
}
const fontsPrefix = '/static/media/';
const pathToFonts = './build' + fontsPrefix;
if (!fs.existsSync(pathToFonts)) {
  throw new Error("Fonts directory doesn't exist");
}

const files = fs.readdirSync(pathToFonts);
const fontBundles = new RegExp(/[-a-z0-9_]+\.[a-z0-9]+\.woff2$/gi);
const preloadLinks = files
  .filter(f => fontBundles.test(f))
  .map(
    f =>
      `<link rel="preload" href="${fontsPrefix}${f}" as="font" type="font/woff2" crossorigin>`
  );

if (!preloadLinks.length) {
  throw new Error('Fonts for preload are not found');
}

fs.readFile(pathToHTML, (err, data) => {
  if (err) {
    throw err;
  }
  const parts = data.toString().split('</title>');
  fs.writeFile(
    pathToHTML,
    [parts[0], '</title>', ...preloadLinks, parts[1]].join(''),
    err => {
      if (err) {
        throw err;
      }
      console.log('Saved preload tags to index.html');
    }
  );
});
