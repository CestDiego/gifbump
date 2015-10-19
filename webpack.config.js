var path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
	{
		name: 'extension',

	    entry: {
	        app:     ['./app/extension/app.js'],
	        options: ['./app/extension/options.js']
	    },

	    output: {
	        path: path.resolve(__dirname, 'dist', 'extension'),
	        publicPath: '/',
	        filename: '[name].js'
	    },
	    module: {
	        loaders: [
	            // Babel loader
	            {
	                test: /\.jsx?$/,
	                exclude: /(node_modules|bower_components)/,
	                loader: 'babel?optional[]=runtime'
	            },
	            // CSS loader
	            {
	                test: /\.css$/,
	                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
	            }
	        ]
	    },
	    resolve: {
	        modulesDirectories: [
	            'node_modules',
	            'resources',
	            'app'
	        ],
	        extensions: ['.js', '.json', '']
	    },
	    plugins: [
	        new ExtractTextPlugin('styles.css')
	    ]
	}
]