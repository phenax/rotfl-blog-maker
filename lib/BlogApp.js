
module.exports= class BlogApp {

	constructor(config) {

		this.port= config.port;

		this._routes= [];

		this._errorHandler= this.error404;
	}

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

		// Find a matching route
		this._routes
			.filter( route => route.get('url').test(req.url) )
			.filter( route => route.has('controller') )
			.forEach( route => route.get('controller').call(this, req, res) );

		// If no match was found, 404!!
		this._errorHandler(req, res);

		// Log the request
		this.logRequest(req, res);
	}


	// Request logger
	logRequest(req, res) {
		console.log(req.url, req.method, res.statusCode);
	}
};
