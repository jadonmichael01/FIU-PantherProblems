var axios = require("axios");
var http = require('http');
var fs = require('fs');
var path = require('path');

var hostname = '127.0.0.1';
var port = 3000;

var server = http.createServer((req, res) => {
  console.log(`Request for ${req.url} received.`);

  if (req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500);
        res.end('Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url.match(/\.css$/)) {
    const cssPath = path.join(__dirname, req.url);
    const fileStream = fs.createReadStream(cssPath, 'UTF-8');

    res.writeHead(200, { 'Content-Type': 'text/css' });
    fileStream.pipe(res);
  } else if (req.url.match(/\.js$/)) {
    const jsPath = path.join(__dirname, req.url);
    const fileStream = fs.createReadStream(jsPath, 'UTF-8');

    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    fileStream.pipe(res);
  } else if (req.url.match(/\.jpg$/) || req.url.match(/\.jpeg$/)) {
    const imagePath = path.join(__dirname, req.url);
    const fileStream = fs.createReadStream(imagePath);

    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    fileStream.pipe(res);
  } else if (req.url.match(/\.png$/)) {
    const imagePath = path.join(__dirname, req.url);
    const fileStream = fs.createReadStream(imagePath);

    res.writeHead(200, { 'Content-Type': 'image/png' });
    fileStream.pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 File Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
