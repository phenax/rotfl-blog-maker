
const fs= require('fs');
const path= require('path');

class Blogs {

	constructor() {

		this.blogPath= path.resolve('./blogs');

		this._blogList= [];
	}

	_titleToFileName(title) {

		title= 
			title
				.split(' ').join('-')
				.split('\'').join('')
				.split('"').join('');

		return title;
	}

	_createBlogFile(index, body) {

		const blog= this.getBlog(index);

		console.log(blog);

		if(!blog) return;

		fs.stat(blog.get('filename'), (err) => {

			if(err) {

				fs.writeFile(blog.get('filename'), body, (err) => {

					if(err)
						throw err;
				});

			} else {

				blog.set('filename', blog.get('filename') + '_' + this._getRandomHash());

				this._createBlogFile(index, body);
			}
		});
	}

	_getRandomHash() {
		return (
			Math.floor(Math.random()*999)).toString(16) + 
			Math.floor(Date.now()/100000).toString(16);
	}


	getBlog(index) {
		return this._blogList[index];
	}

	addBlog(title, body) {

		if(title && body) {

			const blog= new Map();

			blog.set('title', title);
			blog.set('filename', this._titleToFileName(title));

			this._blogList.push(blog);

			this._createBlogFile(this._blogList.length - 1, body);
		}
	}

	getBlogs() {


	}
}


module.exports= new Blogs();