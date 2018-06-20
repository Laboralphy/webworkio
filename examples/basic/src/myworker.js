import Webworkio from '../../../src/Webworkio';

const wwio = new Webworkio();
wwio.worker();
wwio.on('test', function ({msg}, cb) {
    if (msg === 'hello') {
        // callback should always send object type parameters
        cb({greetings: 'hello world'});
    } else {
        cb('');
    }
});
