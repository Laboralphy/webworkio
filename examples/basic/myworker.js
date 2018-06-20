const wwio = new Webworkio();
wwio.service();
wwio.on('test', function ({msg}, cb) {
    if (msg === 'hello') {
        cb('hello world');
    } else {
        cb('');
    }
});
