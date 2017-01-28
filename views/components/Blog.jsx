
import React from 'react';

export default class Blog extends React.Component {

	render() {
		return (
			<div>
				{this.props.title} - {this.props.content}
			</div>
		);
	}
}

Blog.propTypes= {
	title: React.PropTypes.string,
	content: React.PropTypes.string.isRequired
};
