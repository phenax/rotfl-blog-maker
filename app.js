
const NodeApp= require('./lib/BlogApp');

const blog= require('./lib/Blogs');

class App extends NodeApp {

	constructor(config) {
		super(config);

		this.API_ROUTES= this;

		// API routes
		this
			.addRoute(/^\/api\/blog\/add/, this.API_ROUTES.addBlog);

		// Admin panel routes
		this
			.addRoute(/^\/admin(\/(.*))?$/, this.adminRoute);

		// Other routes
		this
			.onError(this.errorHandler)
			.addRoute(/^\/$/, this.indexRoute)
			.addRoute(/^\/blogs$/, this.blogsListRoute)
			.addRoute(/^\/blogs\/(.*)?$/, this.blogRoute);
	}


	// API ROUTE for adding new blogs
	addBlog(req) {

		const title= (req.path.queryobj.title);
		const content= (req.path.queryobj.content);

		// Add a blog
		blog
			.addBlog(title, content)
			.then(title => this.sendJSON({
				status: true,
				message: `Blog:${title} posted successfully`
			}))
			.catch(e => this.sendJSON({
				status: false,
				message: e.message
			}));

	}


	// index route
	indexRoute() {

		console.time('IndexRender');

		this.renderFile('./index.html')
			.then(() => console.timeEnd('IndexRender'))
			.catch(e => this.triggerError(500, e));
	}


	blogsListRoute() {

		console.time('BlogsListingRender');

		const blogs= blog.getAllBlogs();

		this.render('BlogIndexLayout', { blogs })
			.then(() => console.timeEnd('BlogsListingRender'))
			.catch(e => this.triggerError(500, e));
	}


	// Route for /blogs/:blog_name routes
	blogRoute(req) {

		console.time('BlogRender');

		// Get the blog title
		const blogName= this.getTitleFromURL(req.path.pathname);

		this.render('BlogLayout', { blogName })
			.then(() => console.timeEnd('BlogRender'))
			.catch(e => this.triggerError(404, e));
	}

	// Route for the /admin route
	adminRoute() {

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
