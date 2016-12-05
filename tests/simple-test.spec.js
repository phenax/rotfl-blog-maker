
/* eslint-disable */

const { expect }= require('chai');

const app= require('../app');


describe('App Configuration', () => {

	it('should have port', () => {

		expect(app.port).to.exist;

		expect(typeof app.port).to.be.eql('number');
	});

	it('should have atleast one route', () => {

		expect(app._routes).to.not.be.empty;
	});
});


describe('App Router', () => {

	let darkSideCtrlr;

	beforeEach(() => {

		darkSideCtrlr= (req, res) => {};

		app.addRoute(/^\/darth-vader$/, darkSideCtrlr);
	});


	afterEach(() => {

		app.removeRoute({ controller: darkSideCtrlr });
	});


	it('should be able to add routes', () => {

		const matches= app.findRoute('/darth-vader');

		const controller= matches[0].get('controller');

		expect(controller).to.eql(darkSideCtrlr);
	});
});

