var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    series = require('stream-series'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync');

gulp.task('css', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('html', function() {
  gulp.src('src/jade/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('js', function() {
  gulp.src([
    'bower_components/jquery/dist/jquery.js'
  ])
    // concat pulls all our files together before minifying them
    .pipe( concat('output.min.js') )
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
});


gulp.task('scripts', function(){ 
    var target = gulp.src('src/jade/index.jade');
    var initFilePath = gulp.src(['src/scripts/init.js'], {read: false});
    var mdPath = gulp.src(['src/scripts/md/clip-*.js', 'src/scripts/md/meta-*.js'], {read: false});
    var exportString = 'public/js';
    return target.pipe(inject(series(mdPath, initFilePath),{
                ignorePath: 'src/scripts',
                addPrefix: exportString,
                addRootSlash: false
            }))
    .pipe(gulp.dest('src/jade/'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('copy', function(){
  gulp.src('src/scripts/*.js')
    .pipe(gulp.dest('public/js'));
  
  gulp.src('src/scripts/md/*.js')
    .pipe(gulp.dest('public/js/md'));
  
  gulp.src('src/fields/*.png')
    .pipe(gulp.dest('public/fields'));
  
  gulp.src('src/images/*.*')
    .pipe(gulp.dest('public/images'));
});

gulp.task('jshint', function() {
  gulp.src('src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
  gulp.watch('src/jade/*.jade', ['html', 'copy']);
  gulp.watch('src/sass/**/*.scss', ['css', 'copy']);
  gulp.watch('src/scripts/*.js', ['html', 'scripts', 'copy']);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: ""
    }
  });
});

gulp.task('default', ['css', 'scripts', 'copy', 'html', 'js']);
gulp.task('start', ['browser-sync', 'watch']);