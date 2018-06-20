const EventManager = require('events');

/**
 * see README.md for detail
 *
 * @author Raphaël Marandet
 * @date 2018-06-20
 *
 */
class Webworkio {

	constructor() {
		this._callbacks = {};
		this._bLog = false;
		this._callbackLastId = 0;
		this._worker = null;
		this._eventManager = new EventManager();
	}

	/**
	 * Activates verbosity
	 */
	verbose() {
	    this._bLog = true;
    }

	/**
	 * This method acts differently in application context, and in worker context
	 * In application context : Declares a web worker if this method is called by the application.
	 * In worker context : Declares itself as a webworker
	 * @param [w] {string} worker name (if in application context)
	 */
	worker(w) {
		if (w) {
			if (window && window.Worker) {
                this._worker = new Worker(w);
                this._worker.addEventListener('message', event => this._messageReceived(event.data));
                return this._worker;
			} else {
				throw new Error('Web worker feature is not available on this browser.');
			}
		} else {
			addEventListener('message', event => this._messageReceived(event.data));
		}
	}

    /**
	 * Terminates the worker
     */
	terminate() {
		if (this._worker) {
            this._worker.terminate();
		} else {
			close();
		}
	}

	/**
	 * <proxy>
	 * Declares an event listener
	 * @param sEvent {string} event name
	 * @param args {*} list of arguments directly passed to the EventManager "on" method
	 */
	on(sEvent, ...args) {
		this._eventManager.on(sEvent, ...args);
	}

	/**
	 * Transmits data to "the other side"
	 * @param sEvent {string} event name
	 * @param data {*} plain object
	 * @param [callback] {function} a callback function provided by one side, this function is expected to be called back by
	 * the other side.
	 */
	emit(sEvent, data, callback) {
		let packet = Object.assign({}, data, {__event: sEvent});
		if (callback) {
			packet.__callback = this._registerCallback(callback);
		}
		this._log('emitting message', sEvent, packet);
		if (this._worker) {
			this._worker.postMessage(packet);
		} else {
			postMessage(packet);
		}
	}

	/**
	 * ...for debbuging purpose.
	 * @param args
	 * @private
	 */
	_log(...args) {
		if (this._bLog) {
			console.log(!!this._worker ? '[window]' : '[worker]', ...args);
		}
	}

	/**
	 * Registers a callback function
	 * @param callback
	 * @returns {number}
	 * @private
	 */
	_registerCallback(callback) {
		this._callbacks[++this._callbackLastId] = callback;
		return this._callbackLastId;
	}

	/**
	 * Invoke a previously registrer callback function (see _registerCallback)
	 * @param id {number}
	 * @param data {*} arguments passed
	 * @private
	 */
	_invokeCallback(id, data) {
		this._log('invoking callback id', id);
		if (id in this._callbacks) {
			let cb = this._callbacks[id];
			delete this._callbacks[id];
			cb(data);
		} else {
			if (id < this._callbackLastId) {
				throw new Error('this callback id has expired')
			} else {
				throw new Error('this callback has invalid id that has never been used');
			}
		}
	}

	/**
	 * The message event listener
	 * @param data
	 * @private
	 */
	_messageReceived(data) {
		this._log('message received', data);
		let sEvent = data.__event;
		let idCallback = data.__callback;
		let idResponse = data.__response;

		delete data.__event;
		delete data.__callback;
		delete data.__response;
		if (idCallback) {
			this._eventManager.emit(sEvent, data, result => {
				this._log('response', sEvent, 'callback', idCallback, result);
				this.emit(sEvent, Object.assign(result, {__response: idCallback}));
			});
		} else if (idResponse) {
			this._invokeCallback(idResponse, data);
		} else {
			this._eventManager.emit(sEvent, data);
		}
	}
}

module.exports = Webworkio;