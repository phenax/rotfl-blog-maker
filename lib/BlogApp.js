
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

		throw new Error('Error handler needs to be a function');
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

		const matches= this.getMatchingRoute(req.url);

		matches.forEach( route => route.get('controller').call(this, req, res) );

		// If no match was found, 404!!
		if(matches.length === 0)
			this.error(req, res);

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
