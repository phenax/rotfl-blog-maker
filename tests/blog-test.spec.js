

/* eslint-disable */

const fs= require('fs');
const { expect, assert }= require('chai');

const blogs= require('../lib/Blogs');


describe('Blog Creator', () => {

	describe('Blogs configuration and utils', () => {

		it('should convert the title to file-friendly string', () => {

			expect(blogs.filterTitle('Title Gets Converted')).to.eql('title-gets-converted');

			expect(blogs.filterTitle('SD"F\'D\/G/D')).to.eql('sdfd_g_d');
		});

		it('should create a random string of fixed length', () => {

			const random= blogs.getRandomHash();

			expect(random).to.be.a('string');

			expect(random).to.not.be.empty;

			expect(random).to.not.eql(blogs.getRandomHash());

			// To make sure it always has the same length
			for(let i= 0; i< 20; i++)
				expect(blogs.getRandomHash()).to.have.length(random.length);
		});
	});


	describe('Blogs API', () => {

		let title;
		const blogContent= 'sakfjsidghkdjfxghkjdfhjkgdhjkfghj';

		beforeEach((done) => {

			blogs.addBlog('Awesome Blog', blogContent, (err, _title) => {

				if(err) {
					done(err);
					return;
				}

				title= _title;
				done();
			});
		});

		afterEach((done) => {

			blogs
				.deleteAll()
				.then( _ => done());
		});


		it('should fetch the correct blog', (done) => {

			blogs
				.getBlog(title)
				.then( body => {

					expect(body).to.eql(blogContent);
					done();
				})
				.catch( e => done(e) );
		});


		it('should update contents', done => {

			const newContents= 'this is an awesome post\n awesomely updated';

			blogs
				.updateBlog(title, newContents)
				.then( _ => {

					blogs
						.getBlog(title)
						.then( body => {

							expect(body).to.not.eql(blogContent);
							done();
						})
						.catch( e => done(e) );
				})
				.catch( e => done(e) );
		});
	});

});

