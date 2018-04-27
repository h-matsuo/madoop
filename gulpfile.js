const gulp       = require('gulp');
const ts         = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const plumber    = require('gulp-plumber'); // エラー時に Watch を停止させない
const notify     = require('gulp-notify');  // エラー時に通知を出す
const uglify     = require('gulp-uglifyes');// JS minifier (compatible with ES6)
const rename     = require('gulp-rename');

gulp.task('build', () => {
  const project = ts.createProject('./tsconfig.json');
  return gulp.src([
      './src/**/*.ts'
    ])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(project())
    .pipe(sourcemaps.write('./', {
      includeContent: false
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build:watch', ['build'], () => {
  return gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('minify', () => {
  return gulp.src([
    './build/**/*.js',
    '!./build/**/*.min.js'
  ])
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(uglify())
  .on('error', function(e){
    console.error(e);
  })
  .pipe(rename({extname: '.min.js'}))
  .pipe(gulp.dest('./build/'));
});
