/**
 * Created by ralphy on 26/05/17.
 */
const path = require('path');

module.exports = [{
    entry: {
        webworkio: path.resolve(__dirname, 'index.js')
	},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: "/dist/",
    },
    mode: 'development',
	devtool: 'source-map',
	module: {
	},
    target: 'web'
}, {
	name: 'example-basic',
	entry: {
		app: path.resolve(__dirname, 'examples/basic/src/main.js'),
		myworker: path.resolve(__dirname, 'examples/basic/src/myworker.js'),
	},
	output: {
		path: path.resolve(__dirname, 'examples/basic/build'),
		filename: '[name].js',
		publicPath: "/dist/",
	},
	mode: 'development',
	devtool: 'source-map',
	module: {
	},
	target: 'web'
}];
