

/* eslint-disable */

const fs= require('fs');
const { expect }= require('chai');

const blogs= require('../lib/Blogs');


describe('Blogs configuration tests', () => {

	it('should convert the title to file-friendly string', () => {

		expect(blogs.filterTitle('Title Gets Converted')).to.eql('title-gets-converted');

		expect(blogs.filterTitle('SD"F\'D\/G/D')).to.eql('sdfd_g_d');
	});
});


describe('Blogs API', () => {

	const blogName= 'Awesome Blog';
	const blogContent= 'sakfjsidghkdjfxghkjdfhjkgdhjkfghj';

	beforeEach((done) => {

		blogs.addBlog(blogName, blogContent, _ => done());
	});


	afterEach((done) => {

		blogs
			.deleteAll()
			.then( _ => done());
	});


	it('test', () => {

		// done();
	});

});

