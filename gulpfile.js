var gulp          = require('gulp');
var rename        = require('gulp-rename');
var pug           = require('gulp-pug');
var postcss       = require('gulp-postcss');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('autoprefixer');
var sugarss       = require('sugarss');
var precss        = require('precss');
var uncss         = require('gulp-uncss');
var sorting       = require('postcss-sorting');
var cssnext       = require('postcss-cssnext');
var short         = require('postcss-short');
var svginline     = require('postcss-inline-svg');
var colorFunction = require("postcss-color-function");
var mqpacker      = require('css-mqpacker');
var pixrem        = require('pixrem');
var cssnano       = require('cssnano');
var useref        = require('gulp-useref');
var uglify        = require('gulp-uglify');
var spritesmith   = require('gulp.spritesmith');
var gulpIf        = require('gulp-if');
var cache         = require('gulp-cache');
var del           = require('del');
var runSequence   = require('run-sequence');
var browserSync   = require('browser-sync').create();

// default task
gulp.task('default', function (callback) {
  runSequence(['postcss', 'pug', 'browserSync'], 'watch',
    callback
  )
})

// Watch
gulp.task('watch', function(){
  gulp.watch('./pcss/**/*.+(sss|css)', ['postcss']);
  gulp.watch('./views/**/*.pug', ['pug']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
})

/////
// DEVELOPMENT TASKS
/////

var processors = [
    precss(),
    short(),
    colorFunction(),
    svginline(),
    autoprefixer({browsers: ['last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
    // sorting(),
    // mqpacker(),
    pixrem()
];

gulp.task('postcss', function() {
  return gulp.src('./pcss/*.sss')
      .pipe( sourcemaps.init() )
      .pipe( postcss(processors, { parser: sugarss }) )
      .pipe( sourcemaps.write('.') )
      .pipe(rename({ extname: '.css' }))
      .pipe( gulp.dest('./css') )
      .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('uncss', function() {
  return gulp.src([
      'css/3.css'
    ])
    .pipe(uncss({
      html: [
        'http://localhost:3002/catalog.html',
        'http://localhost:3002/files.html'
      ]
    }))
    .pipe(gulp.dest('css-mini/'));
});

gulp.task('pug', function buildHTML() {
  return gulp.src('./pug/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe( gulp.dest('./') )
      .pipe(browserSync.reload({
        stream: true
      }));
});

/////
// OPTIMIZATION TASKS
/////

gulp.task('useref', function(){
  return gulp.src('./*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('cssnano', function () {
  return gulp.src('./css/new.css')
    .pipe( postcss([cssnano({
      autoprefixer: false,
      reduceIdents: {
        keyframes: false
      },
      discardUnused: {
        keyframes: false
      }
    })]) )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('dist/css'));;
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('img/sprites/*.png')
      .pipe(spritesmith({
          /* this whole image path is used in css background declarations */
          imgName: '../img/sprite.png',
          cssName: 'sprite.css'
      }));
  spriteData.img.pipe(gulp.dest('img'));
  spriteData.css.pipe(gulp.dest('css'));
});

// hot reload
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
  })
})
