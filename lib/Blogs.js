
const fs= require('fs');
const path= require('path');

class Blogs {

	constructor(blogPath) {

		this.blogPath= path.resolve(blogPath || './blogs');

		// If the blog directory doesnt exist, create it
		try { fs.statSync(this.blogPath); }
		catch(e) { fs.mkdirSync(this.blogPath); }
	}

	getFileName(title) {
		return path.join(this.blogPath, title + '.md');
	}

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


	_writeFile(title, body) {

		const filePath= this.getFileName(title);

		return new Promise((resolve, reject) => {

			fs.writeFile(filePath, body, err => {

				if(err) {
					reject(err);
					return;
				}

				resolve(title);
			});
		});
	}


	addBlog(title, body, callback) {

		if(typeof title === 'string' && typeof body === 'string') {

			title= this.filterTitle(title);

			this._createBlogFile(title, body, callback);
		}

		return title;
	}


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


	getBlogSync(blogId) {

		return fs
			.readFileSync(this.getFileName(blogId))
			.toString();
	}


	updateBlog(title, body) {
		return this._writeFile(title, body);
	}


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

	getRandomHash() {
		const randStr=
			Math.floor((Math.random() + 1)*1000).toString(16) + 
			Math.floor(Date.now()/100000 + 1).toString(16);
		return randStr;
	}
}


module.exports= new Blogs('./blogs');
