
const fs= require('fs');
const path= require('path');

class Blogs {

	constructor(blogPath) {

		this.blogPath= path.resolve(blogPath || './blogs');

		// If the blog directory doesnt exist, create it
		try { fs.statSync(this.blogPath); }
		catch(e) { fs.mkdirSync(this.blogPath); }
	}


	/**
	 * Get the filepath from the title
	 * 
	 * @param  {string} title  Dashed title of the blog
	 * 
	 * @return {string}        The filepath
	 */
	getFileName(title) {
		return path.join(this.blogPath, title + '.md');
	}


	/**
	 * Create blog file (.md)
	 * 
	 * @param  {string}   title
	 * @param  {string}   body
	 * @param  {Function} callback [description]
	 */
	_createBlogFile(title, body, callback=(() => {})) {

		const filePath= this.getFileName(title);

		fs.stat(filePath, (err) => {

			if(err) {

				this._writeFile(title, body)
					.then( title => callback(null, title))
					.catch( e => {
						callback(e, null);
					});
			} else
				this._createBlogFile(title + '_' + this.getRandomHash(), body, callback);
		});
	}


	/**
	 * Write the blog as a file
	 * 
	 * @param   {string} title
	 * @param   {string} body
	 * 
	 * @return  {Promise}
	 */
	_writeFile(title, body) {

		const filePath= this.getFileName(title);

		return new Promise((resolve, reject) => {

			// Write the file
			fs.writeFile(filePath, body, err => {

				if(err) {
					reject(err);
					return;
				}

				resolve(title);
			});
		});
	}


	/**
	 * Add a new blog
	 * 
	 * @param  {string}   title
	 * @param  {string}   body
	 * @param  {Function} callback
	 *
	 * @return {Promise}
	 */
	addBlog(title, body, callback) {

		if(typeof title === 'string' && typeof body === 'string') {

			title= this.filterTitle(title);

			return new Promise((resolve, reject) => {

				this._createBlogFile(title, body, (err, title) => {

					if(err) reject(err);
					else resolve(title);

					callback(err, title);
				});
			});
		}

		return title;
	}


	/**
	 * Delete all blogs
	 * 
	 * @return {Promise}
	 */
	deleteAll() {

		return this
			._getAllBlogNames()
			.then( files => {

				let deletedCount= 0;

				files.forEach(
					file => {

						const filePath= path.join(this.blogPath, file);

						fs.unlinkSync(filePath);

						deletedCount++;
					}
				);

				return deletedCount === files.length && typeof cb === 'function';
			});
	}


	/**
	 * Get a list of all blogs
	 * 
	 * @return {Promise}
	 */
	_getAllBlogNames() {

		return new Promise((resolve, reject) => {

			fs.readdir(this.blogPath, (err, files) => {

				if(err) {
					reject(err);
					return;
				}

				resolve(files.filter( file => /\.md$/gi.test(file) ));
			});
		});
	}


	/**
	 * Get a blog(READ)
	 * 
	 * @param  {string} blogId  Blog title(or ID)
	 * 
	 * @return {Promise}        Resolves to the blog contents
	 */
	getBlog(blogId) {

		if(typeof blogId !== 'string')
			return Promise.reject(new Error('The blog ID has to be a string'));

		return new Promise((resolve, reject) => {

			fs.readFile(this.getFileName(blogId), (err, body) => {
				if(err) {
					reject(err);
					return;
				}

				resolve(body.toString());
			});
		});
	}


	/**
	 * Get a blog(READ) synchronously
	 * 
	 * @param  {string} blogId  Blog title(or ID)
	 * 
	 * @return {string}         The blog contents
	 */
	getBlogSync(blogId) {

		return fs
			.readFileSync(this.getFileName(blogId))
			.toString();
	}


	/**
	 * Update a blog
	 * 
	 * @param  {string}  title
	 * @param  {string}  body
	 * 
	 * @return {Promise}
	 */
	updateBlog(title, body) {
		return this._writeFile(title, body);
	}


	/**
	 * Filters the title(Title to file friendly title(blog ID))
	 * 
	 * @param  {string} title
	 * 
	 * @return {string}
	 */
	filterTitle(title='') {

		title= 
			title
				.toLowerCase()
				.split(' ').join('-')
				.split('/').join('_')
				.split('\\').join('_')
				.split('\'').join('')
				.split('"').join('');

		return title;
	}


	/**
	 * Get random string of hex characters
	 * 
	 * @return {string}
	 */
	getRandomHash() {
		const randStr=
			Math.floor((Math.random() + 1)*1000).toString(16) + 
			Math.floor(Date.now()/100000 + 1).toString(16);
		return randStr;
	}
}


module.exports= new Blogs('./blogs');
