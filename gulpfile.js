const gulp = require('gulp'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	cssnano = require('gulp-cssnano'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	stripCode = require('gulp-strip-code'),
	uglify = require('gulp-uglify'),
	runSequence = require('run-sequence'),
	stylish = require('jshint-stylish'),
	pug = require('gulp-pug'),
	babel = require('gulp-babel');

gulp.task('clean', () => {
	return gulp.src('dist')
		.pipe(clean());
});

gulp.task('process-scss', () => {
	return gulp.src(['stylesheets/master.scss', 'stylesheets/home.scss'])
		.pipe(sass())
		.pipe(cssnano({ autoprefixer: false }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('process-js', ['concat-js', 'move-page-specific-js'], () => {
	return gulp.src(['dist/js/**/*.js'])
		.pipe(jshint({
			esversion: 6
		}))
		.pipe(jshint.reporter(stylish))
		.pipe(stripCode({
			start_comment: 'test-code',
			end_comment: 'end-test-code'
		}))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('concat-js', () => {
	return gulp.src(['js/utility/*.js', 'js/**/*.js', '!js/vendor/**/*.js', '!js/page-specific/**/*.js'])
		.pipe(concat('master.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('move-page-specific-js', () => {
	return gulp.src('js/page-specific/**/*.js')
		.pipe(gulp.dest('dist/js/page-specific'));
});

gulp.task('move-images',  () => {
	return gulp.src('images/**.*')
		.pipe(gulp.dest('dist/images'));
});

gulp.task('process-pug', () => {
	return gulp.src('mockups/**/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], (callback) => {
	return runSequence(['process-pug', 'process-scss', 'process-js', 'move-images'], callback);
});

gulp.task('watcher', () => {
	gulp.watch('**/*.pug', ['default']);
	gulp.watch('**/*.scss', ['default']);
});