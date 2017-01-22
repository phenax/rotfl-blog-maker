
const NodeApp= require('./lib/BlogApp');

const blog= require('./lib/Blogs');

class App extends NodeApp {

	constructor(config) {
		super(config);

		this.apiCtrlrs= this;

		// Routes config
		this.onError(this.errorHandler)
			.addRoute(/^\/$/, this.indexController)
			.addRoute(/^\/admin(\/(.*))?$/, this.adminController)
			.addRoute(/^\/blog\/(.*)?$/, this.blogController)
			.addRoute(/^\/api\/blog\/add/, this.apiCtrlrs.addBlog);
	}


	// API ROUTE for adding blogs
	addBlog(req) {

		const title= req.path.queryobj.title;
		const content= req.path.queryobj.content;

		// Add a blog
		blog.addBlog(title, content, (err, title) => {

			// For error
			if(err) {
				return this.sendJSON({
					status: false,
					message: err.message
				});
			}

			// Success message
			this.sendJSON({
				status: true,
				message: `Blog:${title} posted successfully`
			});
		});

	}


	// controller for the index route
	indexController() {

		console.time('IndexRender');

		this.renderFile('./index.html')
			.then(() => console.timeEnd('IndexRender'))
			.catch(e => this.triggerError(500, e));
	}

	// controller for /blog/blog-name routes
	blogController(req) {

		console.time('BlogRender');

		const blogName= this.getTitleFromURL(req.path.pathname);

		this.render('BlogLayout', { blogName })
			.then(() => console.timeEnd('BlogRender'))
			.catch(e => this.triggerError(404, e));
	}

	// controller for the /admin route
	adminController() {

		console.time('AdminRender');

		this.render('AdminPanel')
			.then(() => console.timeEnd('AdminRender'))
			.catch(e => this.triggerError(500, e));
	}

	// error handling route
	errorHandler() {
		this.send('404 Error!! Please remain calm.', 400);
	}
}


module.exports= new App({

	// Runnin it on port 8080
	port: 8080
});
