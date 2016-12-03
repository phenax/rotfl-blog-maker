
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
				.toLowerCase()
				.split(' ').join('-')
				.split('\'').join('')
				.split('"').join('');

		return title;
	}

	_createBlogFile(index, body) {

		const blog= this.getBlog(index);

		if(!blog)
			return;

		const filePath= path.join(this.blogPath, blog.get('filename') + '.md');

		console.log(blog, filePath);

		fs.stat(filePath, (err) => {

			if(err) {
				fs.writeFile(filePath, body);
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