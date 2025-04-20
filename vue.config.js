module.exports = {
	publicPath: './',
	outputDir: 'dist',
	productionSourceMap: false,
	chainWebpack: (config) => {
		config.devtool('none');
	}
};
