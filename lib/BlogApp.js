
const fs= require('fs');
const path= require('path');

const { createElement }= require('react');
const { renderToStaticMarkup }= require('react-dom/server');


class HttpError extends Error {

	constructor(message, code, stack) {
		super(message);

		this.statusCode= code;

		if(stack)
			this.stack= stack;
	}
}

/**
 * BlogApp superclass
 */
module.exports= class BlogApp {

	constructor(config) {

		this.port= config.port;

		this._routes= [];

		this._errorHandler= this.error404;
	}

	get error() { return this._errorHandler; }

	onError(controller) {

		if(typeof controller === 'function') {
			this._errorHandler= controller.bind(this);
			return this;
		}

		throw new HttpError('Error handler needs to be a function', 500);
	}

	render(templateName) {

		const filePath= path.resolve('./views', templateName + '.jsx');

		return new Promise((resolve, reject) => {
			fs.stat(filePath, err => {
				if(err)
					reject(err);

				require('babel-register')();

				const App= require(filePath).default;

				let markup= '<!doctype html>';

				markup+= renderToStaticMarkup(createElement(App));

				this._res.writeHead(200);
				this._res.write(markup);
				this._res.end();

				resolve(true);
			});
		});
	}

	renderFile(fileName) {

		const file= path.resolve(fileName);

		return new Promise((resolve, reject) => {
			
			fs.stat(file, (err) => {

				if(err)
					reject(err);

				const file$= fs.createReadStream(file);

				// this._res.writeHead(200, {
					
				// });

				file$.pipe(this._res);
			});
		});
	}

	triggerError(status, error) {

		this.error(
			this._req, this._res, 
			new HttpError(error.message, status, error.stack)
		);
	}

	// Add a route
	addRoute(url, controller) {

		if(!('test' in url))
			throw new Error('The url needs to be a RegExp');

		if(typeof controller !== 'function')
			throw new Error('The second parameter should be a method');

		const route= new Map();

		route.set('url', url);
		route.set('controller', controller);

		this._routes.push(route);

		return this;
	}

	// Default 404 error handler
	error404(req, res) {
		res.writeHead(404);
		res.end('404 Not Found');
	}


	// Request handler
	onRequest(req, res) {

		this._res= res;
		this._req= req;

		const matches= this.getMatchingRoute(req.url);

		matches.forEach( route => route.get('controller').call(this, req, res) );

		// If no match was found, 404!!
		if(matches.length === 0)
			this.triggerError(404, { message: 'File Not Found' });

		// Log the request
		this.logRequest(req, res);
	}

	// Find all routes that match to the url
	getMatchingRoute(url) {

		// Find a matching route
		return this._routes
			.filter( route => route.get('url').test(url) )
			.filter( route => route.has('controller') );
	}


	removeRoute(obj={}) {

		if('index' in obj) {

			this._routes.splice(obj.index, 1);

			return true;

		} else if('controller' in obj) {

			let match= false;

			this._routes=
				this._routes
					.filter(
						route => {

							const isAMatch= route.get('controller') !== obj.controller;

							if(isAMatch) match= true;

							return isAMatch;
						}
					);

			return match;
		}

		return false;
	}


	// Request logger
	logRequest(req, res) {
		console.log(req.url, req.method, res.statusCode);
	}
};
