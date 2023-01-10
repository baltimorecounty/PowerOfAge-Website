const babel = require("gulp-babel"),
  del = require("del"),
  concat = require("gulp-concat"),
  cssnano = require("gulp-cssnano"),
  gulp = require("gulp"),
  runSequence = require("gulp4-run-sequence"),
  jshint = require("gulp-jshint"),
  pug = require("gulp-pug"),
  rename = require("gulp-rename"),
  sass = require('gulp-sass')(require('sass'));
  stripCode = require("gulp-strip-code"),
  stylish = require("jshint-stylish"),
  uglify = require("gulp-uglify"),
  util = require("gulp-util");

gulp.task("clean", (done) => {
  del.sync("dist/*");
  done();
});

gulp.task("process-scss", () => {
  return gulp
    .src("stylesheets/*.scss")
    .pipe(sass())
    .pipe(cssnano({ autoprefixer: false }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("process-js", () => {
  return gulp
    .src([
      "js/utility/namespacer.js",
      "js/utility/*.js",
      "js/**/*.js",
      "!js/vendor/**/*.js",
      "!js/page-specific/**/*.js",
    ])
    .pipe(
      jshint({
        esversion: 6,
      })
    )
    .pipe(jshint.reporter(stylish))
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(
      stripCode({
        start_comment: "test-code",
        end_comment: "end-test-code",
      })
    )
    .pipe(concat("master.js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("move-page-specific-js", () => {
  return gulp
    .src("js/page-specific/**/*.js")
    .pipe(
      jshint({
        esversion: 6,
      })
    )
    .pipe(jshint.reporter(stylish))
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(gulp.dest("dist/js/page-specific"));
});

gulp.task(
  "minify-js",
  gulp.series("process-js", "move-page-specific-js", () => {
    return gulp
      .src("dist/js/**/*.js")
      .pipe(uglify())
      .on("error", (err) => {
        util.log(util.colors.red("[Error]"), err.toString());
      })
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest("dist/js"));
  })
);

gulp.task("move-images", () => {
  return gulp.src("images/**.*").pipe(gulp.dest("dist/images"));
});

gulp.task("process-pug", () => {
  return gulp
    .src(["mockups/*.pug", "mockups/support/*.pug"])
    .pipe(pug())
    .pipe(gulp.dest("dist"));
});

gulp.task("default", async function () {
  runSequence([
    "clean",
    "process-pug",
    "process-scss",
    "minify-js",
    "move-images",
  ]);
});

gulp.task("watcher", () => {
  gulp.watch("**/*.pug", ["default"]);
  gulp.watch("**/*.scss", ["default"]);
  gulp.watch("js/*.js", ["default"]);
  gulp.watch("js/page-specific/*.js", ["default"]);
  gulp.watch("js/utility/*.js", ["default"]);
});
