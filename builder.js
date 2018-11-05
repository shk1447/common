const webpack = require('webpack');
const path = require('path');

const ora = require('ora');

var config = {
    entry: './index.js',
    target: 'node',
    output: {
        path: path.join(__dirname),
        filename: './backend.js'
    },
    externals: {
        knex: 'commonjs knex',
        sharp: 'commonjs sharp',
        "socket.io": 'commonjs socket.io'
    }
};
const spinner = ora('building for production...');
spinner.start();


webpack(config, (err, stats) => {
    console.log('server build complete'); 
    spinner.stop();
});