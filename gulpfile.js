const
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    stripCode = require('gulp-strip-code'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    eslint = require('gulp-eslint');

gulp.task('clean', () => {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('process-scss', () => {
    return gulp.src(['stylesheets/master.scss', 'stylesheets/home.scss'])
        .pipe(sass())
        .pipe(cssnano({
            autoprefixer: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-js', ['process-js', 'move-page-specific-js'], () => {
    return gulp.src(['dist/js/**/*.js'])
        .pipe(uglify())
        .on('error', (err) => {
            util.log(util.colors.red('[Error]'), err.toString());
        })
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('process-js', () => {
    return gulp.src(['js/utility/namespacer.js', 'js/utility/*.js', 'js/**/*.js', '!js/vendor/**/*.js', '!js/page-specific/**/*.js'])
        .pipe(jshint({
            esversion: 6
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(stripCode({
            start_comment: 'test-code',
            end_comment: 'end-test-code'
        }))
        .pipe(concat('master.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('move-page-specific-js', () => {
    return gulp.src('js/page-specific/**/*.js')
        .pipe(jshint({
            varstmt: true,
            esversion: 6,
            eqeqeq: true,
            nocomma: true,
			onevar: false
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js/page-specific'));
});

gulp.task('marty-lint', () => {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
    return gulp.src(['./js/page-specific/**/*.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
});


gulp.task('move-images', () => {
    return gulp.src('images/**.*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('process-pug', () => {
    return gulp.src(['mockups/*.pug', 'mockups/support/*.pug'])
        .pipe(pug())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], (callback) => {
    return runSequence(['process-pug', 'process-scss', 'minify-js', 'move-images'], callback);
});

gulp.task('watcher', () => {
    gulp.watch('**/*.pug', ['default']);
    gulp.watch('**/*.scss', ['default']);
    gulp.watch('js/*.js', ['default']);
    gulp.watch('js/page-specific/*.js', ['default']);
    gulp.watch('js/utility/*.js', ['default']);
});