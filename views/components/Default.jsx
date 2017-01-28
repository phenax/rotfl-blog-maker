
import React from 'react';

export default ({children, head}) => (
	<html>
		<head>
			<title>Blog</title>
			{head}
		</head>
		<body>
			{children}
		</body>
	</html>
);
