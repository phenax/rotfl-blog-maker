
import React from 'react';

export default class Blog extends React.Component {

	render() {
		return (
			<div>
				{this.props.content}
			</div>
		);
	}
}

Blog.propTypes= {
	content: React.PropTypes.string.isRequired
};
