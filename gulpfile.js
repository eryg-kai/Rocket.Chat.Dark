var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean-css');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var fs = require('fs');
var deploy = require('./lib/deploy.js');

/**
 * Deploys the generated CSS file to Rocket.Chat.
 */
gulp.task('deploy', ['dark', 'custom'], function (done) {
	var file = fs.existsSync('src/custom.styl') ? 'custom.css' : 'dark.css';
	deploy(__dirname + '/dist/' + file, function (error) {
		done(error);
		process.exit(); // TODO: Figure this out.
	});
});

/**
 * Generates the standard works-for-everyone CSS files that get committed.
 */
gulp.task('dark', function () {
	return gulp.src('src/dark.styl')
		.pipe(stylus())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie 8', 'ie 9'],
			cascade: false,
			remove: false
		}))
		.pipe(gulp.dest('dist'))
		.pipe(rename('dark.min.css'))
		.pipe(clean({
			compatibility: 'ie8'
		}))
		.pipe(gulp.dest('dist'));
});

/**
 * This generates a custom build that shouldn't be in source control. Only runs
 * if src/custom.styl exists.
 */
gulp.task('custom', function () {
	if (fs.existsSync('src/custom.styl')) {
		return gulp.src('src/custom.styl')
			.pipe(stylus())
			.pipe(autoprefixer({
				browsers: ['last 2 versions', 'ie 8', 'ie 9'],
				cascade: false,
				remove: false
			}))
			.pipe(gulp.dest('dist'))
			.pipe(rename('custom.min.css'))
			.pipe(clean({
				compatibility: 'ie8'
			}))
			.pipe(gulp.dest('dist'));
	}
});

gulp.task('watch', function () {
	gulp.watch('src/dark*', ['dark']);
});

gulp.task('default', ['dark', 'custom']);
