
import React from 'react';

import blog from '../lib/Blogs';
import Blog from './components/Blog.jsx';


export default class BlogLayout extends React.Component {

	getBlog() {
		let blogContent;

		try {
			blogContent= blog.getBlogSync(this.props.blogName);
		} catch(e) {
			throw new Error('Blog not found');
		}

		return blogContent;
	}

	render() {

		const content= this.getBlog();

		return (
			<html>
				<head>
					<title>Blog</title>
				</head>
				<body>
					<Blog content={content} />
				</body>
			</html>
		);
	}
}

BlogLayout.propTypes= {
	blogName: React.PropTypes.string.isRequired
};
