require.config({
	paths: {
		'jquery': '../../node_modules/jquery/dist/jquery',
		'requirejs': '../../node_modules/requirejs/require',
		'handlebars.runtime': '../../node_modules/handlebars/dist/handlebars.runtime',
		'autosize-input': '../../node_modules/autosize-input/autosize-input',
		'hammerjs': '../../node_modules/hammerjs/hammer',
		'typekit': 'https://use.typekit.net/ewf6qzj'
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'typekit': {
			exports: 'Typekit'
		}
	}
});

requirejs(
	['services/Api', 'models/AppModel', 'views/AppView',
	'controllers/AppController'],
	function(Api, AppModel, AppView, AppController) {

	var model = new AppModel('Walter White', 'Breaking Bad'),
		view = new AppView(model),
		controller = new AppController(model, view);
});
