const path = require('path');

module.exports = {
    entry: './src/js/player.js',
    output: {
        filename: 'player.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'CustomPlayer',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
        ],
    },
    mode: 'production',
};
