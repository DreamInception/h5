var gulp = require('gulp');
//var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-mini-css');
//var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename'); 
var del = require('del');

var paths = {
  scripts: ['scripts/activities/*.js', 'scripts/product/**/*.js','scripts/product/*.js'],
  images: ['images/*.png','images/*.jpg'],
  css: ['css/*.css']
};


gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});
gulp.task('css',['clean'],function(){
	return gulp.src(paths.css)
			.pipe(cssmin())
			.pipe(concat('all.min.css'))
			.pipe(gulp.dest('build/css'));
});
gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
 //   .pipe(sourcemaps.init())
  //    .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
 //   .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/images'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.css,['css']);	
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch','css','scripts', 'images']);