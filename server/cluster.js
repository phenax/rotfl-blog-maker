
const cluster= require('cluster');
const os= require('os');

const createServer= require('./http');

if(cluster.isMaster) {

	os.cpus().forEach(() => cluster.fork());

	cluster.on('exit', () => cluster.fork());
} else {
	createServer((port) => console.log(`Listening to port ${port}`));
}
