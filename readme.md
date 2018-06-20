# Webworkio


## Purpose

This class helps you deal with web-workers in a way which looks like the
way socket.io does with websockets.

The purpose of this class is to greatly simplify the use of web workers
and to mimic socket.io's callback feature.

Basically, an application emits a message to a webworker, providing a
callback function (_CB_). The webworker will call _CB_ after
completing its task. The application will then be notify back and
receive any data passed as argument to _CB_.



## example

__Application.js__

```javascript
class Application {
	run() {
	    this.wwio = new Webworkio();
    	this.wwio.worker('./myworker.js');
    	this.wwio.emit('test', {msg: 'hello'}, function(result) {
			console.log('web worker initialized', result);
		});
	}
}
```

__myworker.js__

```javascript
const wwio = new Webworkio();
wwio.worker();
wwio.on('test', function ({msg}, cb) {
  if (msg === 'hello') {
    cb('hello world');
  } else {
    cb('');
  }
});
```
