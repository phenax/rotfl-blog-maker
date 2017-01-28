
const fs= require('fs');
const path= require('path');
const zlib= require('zlib');
const url= require('url');

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

		// http port to use
		this.port= config.port;

		// List of all routes
		this._routes= [];

		this._views= './views';

		this._errorHandler= this.error404;
	}

	// Error handler getter
	get error() { return this._errorHandler; }

	setViews(viewsPath) {
		this._views= viewsPath;
	}

	// Error handler setter
	onError(controller) {

		// The handler has to be a function
		if(typeof controller === 'function') {
			this._errorHandler= controller.bind(this);
			return this;
		}

		// Else ALL HELL BREAKS LOOSE!!
		throw new HttpError('Error handler needs to be a function', 500);
	}

	// Render a template 
	render(templateName, templateData={}) {

		const filePath= path.resolve(this._views, templateName + '.jsx');

		return new Promise((resolve, reject) => {

			// Check to see if the view template/component exists
			fs.stat(filePath, err => {
				if(err) reject(err);

				// Markup needs a doctype bruh
				let markup= '<!doctype html>';

				try {
					// TODO: Use simple babel to string transpilation instead
					require('babel-register')();

					const App= require(filePath).default;

					markup+= renderToStaticMarkup(createElement(App, templateData));

					this.send(markup);
					
					resolve(markup);
				} catch(e) {
					reject(e);
				}

			});
		});
	}

	// Send content as response
	send(content, status=200) {

		this._res.writeHead(status);
		this._res.write(content);
		this._res.end();
	}

	// Render a file to response
	renderFile(fileName) {

		const file= path.resolve(fileName);

		return new Promise((resolve, reject) => {
			
			fs.stat(file, (err) => {

				if(err)
					reject(err);

				try {
					const file$= fs.createReadStream(file);

					this.compressStream(file$).pipe(this._res);
					
					resolve(file$);
				} catch(e) { reject(e); }

			});
		});
	}

	_getCompressionType() {

		const GZIP= 'gzip';
		const DEFL= 'deflate';

		let compressionType= false;

		const acceptEncoding = this._req.headers['accept-encoding'] || '';

		// Identify the compression supported
		if (acceptEncoding.includes(GZIP))
			compressionType= GZIP;
		else if (acceptEncoding.includes(DEFL))
			compressionType= DEFL;

		return compressionType;
	}

	compressStream(stream$) {

		const compressionType= this._getCompressionType();

		// If compression is supported
		if(compressionType) {

			this._res.writeHead(200, { 'Content-Encoding': compressionType });

			const outer$= (compressionType === 'gzip')? zlib.createGzip(): zlib.createDeflate();

			return stream$.pipe(outer$);
		}

		return stream$;
	}

	// Trigger an error(send error)
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


	// Get the title from the url
	// TODO: Make this more dynamic(Get the blog title from app.js)
	getTitleFromURL(url) {

		if(!url) {
			url= this._req.path.pathname;
		}

		return url.replace('/blog/', '');
	}


	// Request handler
	onRequest(req, res) {

		this._extendContext(req, res);

		this._res= res;
		this._req= req;

		const matches= this.getMatchingRoute(req.path.pathname);

		matches.forEach( route => route.get('controller').call(this, req, res) );

		// If no match was found, 404!!
		if(matches.length === 0)
			this.triggerError(404, { message: 'File Not Found' });

		// Log the request
		this.logRequest(req, res);
	}


	// Extend the request and response by adding addition functionality
	_extendContext(req) {

		req.path= url.parse(req.url);
		req.path.queryobj= {}; 
		const query= (req.path.query || '').split('&');

		// console.log((req.path.query)? req.path.query.hello + '--------': '--');
		// console.log(req.path);

		query.forEach(val => {
			const key_val= val.split('=');
			req.path.queryobj[unescape(key_val[0])]= unescape(key_val[1]);
		});
	}

	// Send a json to the user(for api routes)
	sendJSON(obj) {

		this._res.writeHead(200, { 'Content-Type': 'application/json' });

		this._res.end(JSON.stringify(obj));
	}

	// Find all routes that match to the url
	getMatchingRoute(url) {

		// Find a matching route
		return this._routes
			.filter( route => route.get('url').test(url) )
			.filter( route => route.has('controller') );
	}

	// Remove a route
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
		console.log(req.path.pathname, req.method, res.statusCode);
	}
};
