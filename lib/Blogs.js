
const fs= require('fs');
const path= require('path');

class Blogs {

	constructor() {

		this.blogPath= path.resolve('./blogs');

		this._blogList= [];
	}

	_createBlogFile(index, body, cb) {

		const blog= this.getBlog(index);

		if(!blog)
			return;

		const filePath= path.join(this.blogPath, blog.get('filename') + '.md');

		fs.stat(filePath, (err) => {

			if(err) {
				fs.writeFile(filePath, body, err => {
					if(err)
						throw err;

					if(cb)
						cb(blog);
				});
			} else {

				blog.set('filename', blog.get('filename') + '_' + getRandomHash());

				this._createBlogFile(index, body);
			}
		});
	}

	getBlog(index) {
		return this._blogList[index];
	}

	addBlog(title, body) {

		if(title && body) {

			const blog= new Map();

			blog.set('title', title);
			blog.set('filename', titleToFileName(title));

			this._blogList.push(blog);

			this._createBlogFile(this._blogList.length - 1, body);
		}
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
}



function titleToFileName(title='') {

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


function getRandomHash() {
	return (
		Math.floor(Math.random()*999)).toString(16) + 
		Math.floor(Date.now()/100000).toString(16);
}


module.exports= new Blogs();