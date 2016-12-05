#!/usr/bin/env node

const http= require('http');

const app= require('../app');

// TODO: Add clustering
// TODO: Add https support

http.createServer((req, res) => app.onRequest(req, res)).listen(app.port || 8080);
