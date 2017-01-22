
import React from 'react';

import Blog from './components/Blog.jsx';

export default class BlogLayout extends React.Component {

	getContents(blogName) {

		

	}

	render() {

		const content= this.getContents(this.props.blogName);

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
