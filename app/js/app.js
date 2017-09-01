require.config({
	paths: {
		'jquery': '../../node_modules/jquery/dist/jquery.min',
		'handlebars': '../../node_modules/handlebars/dist/handlebars'
	},
	shim: {
		'jquery': {
			exports: '$'
		}
	}
});

requirejs(
	['services/Api', 'models/AppModel', 'views/AppView', 'controllers/AppController'],
	function(Api, AppModel, AppView, AppController) {

	var model = new AppModel(),
		view = new AppView(model),
		controller = new AppController(model, view);
});
