
const NodeApp= require('./lib/BlogApp');

class App extends NodeApp {

	constructor(config) {
		super(config);

		this.apiCtrlrs= {
			addBlog() {
				
			}
		};

		// Routes config
		this.onError(this.errorHandler)
			.addRoute(/^\/$/, this.indexController)
			.addRoute(/^\/admin(\/(.*))?$/, this.adminController)
			.addRoute(/^\/api\/blog\/add$/, this.apiCtrlrs.addBlog)
			.addRoute(/^\/blog\/(.*)?$/, this.blogController);
	}

	// controller for the index route
	indexController() {

		console.time('IndexRender');

		this.renderFile('./index.html')
			.then(() => console.timeEnd('IndexRender'))
			.catch(e => this.triggerError(500, e));
	}

	blogController() {

		console.time('BlogRender');

		const blogName= this.getTitleFromURL();

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
