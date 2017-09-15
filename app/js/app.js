require.config({
	paths: {
		'jquery': '../../node_modules/jquery/dist/jquery.min',
		'handlebars': '../../node_modules/handlebars/dist/handlebars',
		'autosize-input': '../../node_modules/autosize-input/autosize-input.min',
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
