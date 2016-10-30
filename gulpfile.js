var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean-css');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');

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

gulp.task('watch', function () {
	gulp.watch('src/dark*', ['dark']);
});

gulp.task('default', ['dark']);
