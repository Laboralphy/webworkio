import Webworkio from '../../../src/Webworkio';

class Application {
	run() {
	    this.wwio = new Webworkio();
    	this.wwio.worker('build/myworker.js');
    	this.wwio.emit('test', {msg: 'hello'}, function(result) {
			console.log('web worker response :', result.greetings);
		});
	}
}

export default Application;