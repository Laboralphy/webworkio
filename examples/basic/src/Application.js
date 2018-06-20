import Webworkio from '../../../src/Webworkio';

class Application {
	run() {
	    this.wwio = new Webworkio();
    	this.wwio.service('build/myworker.js');
    	this.wwio.emit('test', {msg: 'hello'}, function(result) {
			console.log('web worker initialized', result);
		});
	}
}

export default Application;