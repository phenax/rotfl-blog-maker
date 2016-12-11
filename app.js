
const NodeApp= require('./lib/BlogApp');
// const Blogs= require('./lib/Blogs');

// Blogs.addBlog('My Third Blog', '# Just Testing\n\nAwesomeness awaits\n');


class App extends NodeApp {

	constructor(config) {
		super(config);

		this.onError(this.errorHandler)
			.addRoute(/^\/$/, this.indexController)
			.addRoute(/^\/admin(\/(.*))?$/, this.adminController);
	}

	indexController() {

		this
			.renderFile('./index.html')
			.catch(e => this.triggerError(500, e));
	}

	adminController() {

		this
			.render('AdminPanel')
			.catch(e => this.triggerError(500, e));
	}

	errorHandler(req, res) {
		res.writeHead(404);
		res.end('Error happens dude. Calm down.');
	}
}


module.exports= new App({
	port: 8080
});
