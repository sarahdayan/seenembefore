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
		tasks: ['sass','browserSync', 'watch']
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

	// ----- JS ----- //

	js: {
		files: 'app/js/**/*.js'
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
			callback: ['sass']
		},
		html: {
			files: 'app/*.html',
			callback: browserSync.reload
		},
		js: {
			files: 'app/js/**/*.js',
			callback: ['jshint', browserSync.reload]
		}
	},

	// ----- Clean ----- //

	clean: {
		src: ['dist/**/*', '!dist/images', '!dist/images/**/*']
	},

	// ----- Build ----- //

	build: {
		tasks: ['clean', 'useref', 'images', 'requirejs']
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
//   Task: JSHint
// -------------------------------------

gulp.task('jshint', function() {
	return gulp.src(options.js.files)
		.pipe(plugins.jshint(jshintConfig))
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(plugins.jshint.reporter('fail'));
});

// -------------------------------------
//   Task: Watch
// -------------------------------------

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch(options.watch.sass.files, options.watch.sass.callback);
	gulp.watch(options.watch.html.files, options.watch.html.callback);
	gulp.watch(options.watch.js.files, options.watch.js.callback);
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
	runSequence(options.default.tasks, callback);
});

// -------------------------------------
//   Task: Build
// -------------------------------------

gulp.task('build', function(callback) {
	options.build.tasks.push(callback);
	runSequence.apply(this, options.build.tasks);
});
