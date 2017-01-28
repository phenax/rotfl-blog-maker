
import React from 'react';

import Blog from './components/Blog.jsx';
import Default from './components/Default.jsx';

import blog from '../lib/Blogs';


export default class BlogLayout extends React.Component {

	getBlog() {
		let blogContent;

		try {
			blogContent= blog.getBlogSync(this.props.blogName);
		} catch(e) {
			throw new BlogLayout.BlogNotFoundError();
		}

		return blogContent;
	}

	render() {

		const content= this.getBlog();

		return (
			<Default>
				<Blog content={content} />
			</Default>
		);
	}
}

BlogLayout.BlogNotFoundError= class extends Error {
	constructor() {
		super('Blog not found');
	}
};

BlogLayout.propTypes= {
	blogName: React.PropTypes.string.isRequired
};
