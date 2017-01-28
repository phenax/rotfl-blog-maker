
import React from 'react';

import Blog from './components/Blog.jsx';
import Default from './components/Default.jsx';

export default class BlogIndexLayout extends React.Component {

	render() {
		return (
			<Default>
				<div>{this.props.blogs.length} blog posts</div>
				<div>{this.props.blogs.blogs.map((blog, i) => <Blog key={i} {...blog} />)}</div>
			</Default>
		);
	}
}

BlogIndexLayout.propTypes= {
	blogs: React.PropTypes.object.isRequired
};
