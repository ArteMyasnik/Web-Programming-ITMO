const path = require('path');

module.exports = {
    entry: './src/main/webapp/resources/ts/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/main/webapp/resources/js'),
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map'
};