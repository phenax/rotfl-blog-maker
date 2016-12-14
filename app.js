
const NodeApp= require('./lib/BlogApp');

class App extends NodeApp {

	constructor(config) {
		super(config);

		// Routes config
		this.onError(this.errorHandler)
			.addRoute(/^\/$/, this.indexController)
			.addRoute(/^\/admin(\/(.*))?$/, this.adminController);
	}

	// controller for the index route
	indexController() {

		this.renderFile('./index.html')
			.catch(e => this.triggerError(500, e));
	}

	// controller for the /admin route
	adminController() {

		this.render('AdminPanel')
			.catch(e => this.triggerError(500, e));
	}

	// error handling route
	errorHandler(req, res) {
		res.writeHead(404);
		res.end('Error happens dude. Calm down.');
	}
}


module.exports= new App({

	// Runnin it on port 8080
	port: 8080
});
