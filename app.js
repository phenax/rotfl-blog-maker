
const NodeApp= require('./lib/BlogApp');

const blog= require('./lib/Blogs');

class App extends NodeApp {

	constructor(config) {
		super(config);

		this.apiCtrlrs= {
			addBlog(req) {

				const title= req.path.queryobj.title;
				const content= req.path.queryobj.content;

				blog.addBlog(title, content, (err, title) => {

					if(err) {
						return this.sendJSON({
							status: false,
							message: err.message
						});
					}

					this.sendJSON({
						status: true,
						message: `Blog:${title} posted successfully`
					});
				});

			}
		};

		// Routes config
		this.onError(this.errorHandler)
			.addRoute(/^\/$/, this.indexController)
			.addRoute(/^\/admin(\/(.*))?$/, this.adminController)
			.addRoute(/^\/api\/blog\/add/, this.apiCtrlrs.addBlog)
			.addRoute(/^\/blog\/(.*)?$/, this.blogController);
	}

	// controller for the index route
	indexController() {

		console.time('IndexRender');

		this.renderFile('./index.html')
			.then(() => console.timeEnd('IndexRender'))
			.catch(e => this.triggerError(500, e));
	}

	blogController(req) {

		console.time('BlogRender');

		const blogName= this.getTitleFromURL(req.url);

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
