#!/usr/bin/env node
// genz++ web playground server
// usage: node serve.js [port]

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2]) || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.genz': 'text/plain',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/web/index.html';

  const filePath = path.join(ROOT, url);

  // don't escape the project directory
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('nah');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('ghosted');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n  genz++ playground serving at http://localhost:${PORT}\n`);
});
