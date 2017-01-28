
import React from 'react';

import Blog from './components/Blog.jsx';
import Default from './components/Default.jsx';

export default class BlogIndexLayout extends React.Component {

	render() {
		return (
			<Default>
				{this.props.blogs.map((blog, i) => <Blog key={i} {...blog} />)}
			</Default>
		);
	}
}

BlogIndexLayout.propTypes= {
	blogs: React.PropTypes.array.isRequired
};
