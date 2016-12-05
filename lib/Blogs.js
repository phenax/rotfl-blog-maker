
const fs= require('fs');
const path= require('path');

class Blogs {

	constructor() {

		this.blogPath= path.resolve('./blogs');
	}

	_createBlogFile(title, body, callback) {

		const filePath= path.join(this.blogPath, title + '.md');

		fs.stat(filePath, (err) => {

			if(err) {
				fs.writeFile(filePath, body, err => {
					if(err)
						throw err;

					if(typeof callback === 'function')
						callback(this.blogPath + '/' + title + '.md');
				});
			} else
				this._createBlogFile(title + '_' + getRandomHash(), body, callback);
		});
	}


	addBlog(title, body, callback) {

		if(typeof title === 'string' && typeof body === 'string') {

			this._createBlogFile(this.filterTitle(title), body, callback);
		}
	}


	deleteAll() {

		console.time('wow');

		return this
			._getAllBlogNames()
			.then( files => {

				let deletedCount= 0;

				files.forEach(
					file => {

						const filePath= path.join(this.blogPath, file);

						try { fs.unlinkSync(filePath); }
						catch(e) { throw e; }

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
}


function getRandomHash() {
	return (
		Math.floor(Math.random()*999)).toString(16) + 
		Math.floor(Date.now()/100000).toString(16);
}


module.exports= new Blogs();