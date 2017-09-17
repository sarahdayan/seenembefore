// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   `gulp`
//   `gulp watch`
//   `gulp sass`
//   `gulp jshint`
//   `gulp handlebars`
//   `gulp browserSync`
//   `gulp useref`
//   `gulp clean`
//   `gulp build`
//
// *************************************

var gulp         = require('gulp');
var plugins      = require('gulp-load-plugins')();
var browserSync  = require('browser-sync');
var del          = require('del');
var runSequence  = require('run-sequence');
var requirejs    = require('requirejs');
var pkg          = require('./package');
var jshintConfig = pkg.jshintConfig;

var options = {

	// ----- Default ----- //

	default: {
		tasks: ['iconfont', 'sass', 'handlebars', 'browserSync', 'watch']
	},

	// ----- Browser Sync ----- //

	browserSync: {
		server: ['app', '']
	},

	// ----- Sass ----- //

	sass: {
		files: 'app/scss/**/*.scss',
		destination: 'app/css'
	},

	// ----- Icon Font ----- //

	icons: {
		files      : 'app/svg/**/*',
		path       : 'app/fonts/scss/_icons-template.scss',
		fontName   : 'icons',
		targetPath : 'scss/_icons.scss',
		fontPath   : '../fonts/',
		fontName   : 'icons',
		destination: 'app/fonts'
	},

	// ----- JS ----- //

	js: {
		files: 'app/js/**/*.js'
	},

	// ----- Handlebars ----- //

	handlebars: {
		commands: {
			precompile: 'handlebars app/js/templates/*.handlebars.html -f app/js/templates/templates.js -m -a'
		}
	},

	// ----- Useref ----- //

	useref: {
		files: 'app/*.html'
	},

	// ----- RequireJS ----- //

	requirejs: {
		baseUrl: 'app/js',
		paths: {
			jquery: '../../node_modules/jquery/dist/jquery.min',
			requirejs: '../../node_modules/requirejs/require'
		},
		preserveLicenseComments: false,
		name: 'app',
		out: 'dist/js/app.min.js',
		include: ['requirejs']
	},

	// ----- Images ----- //

	images: {
		files: 'app/images/**/*.+(png|jpg|jpeg|gif|svg)',
		destination: 'dist/images'
	},

	// ----- Watch ----- //

	watch: {
		sass: {
			files: 'app/scss/**/*.scss',
			callback: ['sass', browserSync.reload]
		},
		html: {
			files: 'app/*.html',
			callback: browserSync.reload
		},
		js: {
			files: ['app/js/**/*.js', '!app/js/templates/templates.js'],
			callback: ['jshint', browserSync.reload]
		},
		templates: {
			files: ['app/js/templates/**/*.handlebars.html', '!app/js/templates/templates.js'],
			callback: ['handlebars', browserSync.reload]
		},
		iconfont: {
			files: 'app/svg/**/*.svg',
			callback: ['iconfont', 'sass']
		}
	},

	// ----- Clean ----- //

	clean: {
		src: ['dist/**/*', '!dist/images', '!dist/images/**/*']
	},

	// ----- Build ----- //

	build: {
		tasks: ['clean', 'useref', 'images', 'handlebars', 'requirejs']
	}
};

// -------------------------------------
//   Task: Browser Sync
// -------------------------------------

gulp.task('browserSync', function() {
	browserSync({
		server: options.browserSync.server
	});
});

// -------------------------------------
//   Task: Sass
// -------------------------------------

gulp.task('sass', function() {
	return gulp.src(options.sass.files)
		.pipe(plugins.sass().on('error', plugins.sass.logError))
		.pipe(plugins.autoprefixer())
		.pipe(gulp.dest(options.sass.destination))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// -------------------------------------
//   Task: Icon Font
// -------------------------------------

gulp.task('iconfont', function() {
	return gulp.src(options.icons.files)
		.pipe(plugins.iconfontCss({
			path: options.icons.path,
			fontName: options.icons.fontName,
			targetPath: options.icons.targetPath,
			fontPath: options.icons.fontPath
		}))
		.pipe(plugins.iconfont({
			fontName: options.icons.fontName,
			normalize: true,
			fontHeight: 1001
		}))
		.pipe(gulp.dest(options.icons.destination));
});

// -------------------------------------
//   Task: JSHint
// -------------------------------------

gulp.task('jshint', function() {
	return gulp.src(options.js.files)
		.pipe(plugins.jshint(jshintConfig))
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(plugins.jshint.reporter('fail'));
});

// -------------------------------------
//   Task: Handlebars
// -------------------------------------

gulp.task('handlebars', plugins.shell.task([
	options.handlebars.commands.precompile
]));

// -------------------------------------
//   Task: Watch
// -------------------------------------

gulp.task('watch', function() {
	gulp.watch(options.watch.sass.files, options.watch.sass.callback);
	gulp.watch(options.watch.html.files, options.watch.html.callback);
	gulp.watch(options.watch.js.files, options.watch.js.callback);
	gulp.watch(options.watch.templates.files, options.watch.templates.callback);
	gulp.watch(options.watch.iconfont.files, options.watch.iconfont.callback);
})

// -------------------------------------
//   Task: Useref
// -------------------------------------

gulp.task('useref', ['clean', 'jshint', 'sass'], function() {
	return gulp.src(options.useref.files)
		.pipe(plugins.useref())
		.pipe(plugins.if('*.html', plugins.htmlmin({collapseWhitespace: true})))
		.pipe(plugins.if('*.js', plugins.uglify()))
		.pipe(plugins.if('*.css', plugins.cssnano({discardComments: {removeAll: true}})))
		.pipe(gulp.dest('dist'));
});

// -------------------------------------
//   Task: RequireJS
// -------------------------------------

gulp.task('requirejs', function() {
	return requirejs.optimize(options.requirejs, function (buildResponse) {
		var contents = fs.readFileSync(options.requirejs.out, 'utf8');
	}, function(err) {
		console.log(err);
	});
});

// -------------------------------------
//   Task: Images
// -------------------------------------

gulp.task('images', function() {
	return gulp.src(options.images.files)
		.pipe(plugins.cache(plugins.imagemin({interlaced: true})))
		.pipe(gulp.dest(options.images.destination));
});

// -------------------------------------
//   Task: Clean: Dist
// -------------------------------------

gulp.task('clean', function() {
	return del.sync(options.clean.src);
});

// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task('default', function(callback) {
	options.default.tasks.push(callback);
	runSequence.apply(this, options.default.tasks);
});

// -------------------------------------
//   Task: Build
// -------------------------------------

gulp.task('build', function(callback) {
	options.build.tasks.push(callback);
	runSequence.apply(this, options.build.tasks);
});
