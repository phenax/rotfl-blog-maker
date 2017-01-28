
import React from 'react';

import Blog from './components/Blog.jsx';
import Default from './components/Default.jsx';

import blog from '../lib/Blogs';


/**
 * BlogLayout (/blog/:blog_name)
 */
export default class BlogLayout extends React.Component {

	/**
	 * Get the blog contents
	 * 
	 * @return {string}
	 */
	getBlogContents() {
		let blogContent;

		try {
			blogContent= blog.getBlogSync(this.props.blogName);
		} catch(e) {
			throw new BlogLayout.BlogNotFoundError();
		}

		return blogContent;
	}

	render() {

		return (
			<Default>
				<Blog content={this.getBlogContents()} />
			</Default>
		);
	}
}


/**
 * BlogNotFoundError
 *
 * @type {class}
 * 
 * @extends Error
 */
BlogLayout.BlogNotFoundError= class extends Error {
	constructor() {
		super('Blog not found');
	}
};


// PropTypes
BlogLayout.propTypes= {
	blogName: React.PropTypes.string.isRequired
};
