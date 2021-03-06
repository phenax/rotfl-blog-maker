
/* eslint-disable */

const { expect }= require('chai');

const app= require('../app');


describe('App', () => {

	// Make sure everything is ready to go
	describe('Configuration', () => {

		it('should have port', () => {

			expect(app.port).to.exist;

			expect(typeof app.port).to.eql('number');
		});


		it('should have atleast one route', () => {

			expect(app._routes).to.not.be.empty;
		});


		it('should have a custom 404 error handler', () => {

			expect(app.error).to.exist;

			expect(app.error).to.be.instanceof(Function);

			expect(app.error).to.not.eql(app.error404);
		});
	});


	// All routing functionality works
	describe('Router', () => {

		const darkSideCtrlr= (req, res) => {};

		const darkSideUrl= '/darth-vader-will-rise';

		beforeEach(() => {
			app.addRoute(new RegExp(`^${darkSideUrl}$`), darkSideCtrlr);
		});

		afterEach(() => {
			app.removeRoute({ controller: darkSideCtrlr });
		});


		it('should be able to match routes', () => {

			const matches= app.getMatchingRoute(darkSideUrl);

			expect(matches).to.not.be.empty;

			const controller= matches[0].get('controller');

			expect(controller).to.eql(darkSideCtrlr);
		});
	});
});

