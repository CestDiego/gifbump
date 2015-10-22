var path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
	{
		name: 'extension',

	    entry: {
	        app:     ['./app/extension/index.jsx'],
	        options: ['./app/extension/options.jsx']
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
	            // // CSS loader
	            // {
	            //     test: /\.css$/,
	            //     loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
	            // }
	            // CSS loader
	            {
	                test: /\.scss$/,
	                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
	            },
	            {
	                test: /\.woff2$/,
	                loader: 'file'
	            }
	        ]
	    },
	    resolve: {
	        modulesDirectories: [
	            'node_modules',
	            'resources',
	            'app'
	        ],
	        extensions: ['.js', '.json', '.jsx', '']
	    },
	    plugins: [
	        new ExtractTextPlugin('styles.css')
	    ]
	}
]
