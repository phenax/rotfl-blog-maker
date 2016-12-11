#!/usr/bin/env node

const http= require('http');

const app= require('../app');

const createServer= 
	(callback=(() => {})) => 
		http
			.createServer((req, res) => app.onRequest(req, res))
			.listen(
				app.port || 8080, 
				() => callback(app.port || 8080)
			);

if(require.main === module) {
	createServer((port) => console.log(`Listening to port ${port}`));
}

module.exports= createServer;
