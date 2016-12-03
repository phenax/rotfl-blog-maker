
const http= require('http');

const app= require('../app');

// TODO: Add clustering

http.createServer((req, res) => app.onRequest(req, res)).listen(app.port || 8080);
