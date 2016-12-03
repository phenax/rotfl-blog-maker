
const NodeApp= require('./lib/BlogApp');

const Blogs= require('./lib/Blogs');

Blogs.addBlog('My First Blog', '# Just Testing\n\nAwesomeness awaits\n');

class App extends NodeApp {

	constructor(config) {
		super(config);

		this
			.addRoute(/^\/$/, this.indexController)
			.addRoute(/^\/blog(.*)/, this.blogController)
			.onError(this.errorHandler);
	}

	indexController(req, res) {
		res.end('Index route');
	}

	blogController(req, res) {
		res.end('Blog zone');
	}

	errorHandler(req, res) {
		res.writeHead(404);
		res.end('Error happens dude. Calm down.');
	}
}


module.exports= new App({
	port: 8080
});
