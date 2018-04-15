const gulp       = require('gulp');
const ts         = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const plumber    = require('gulp-plumber'); // エラー時に Watch を停止させない
const notify     = require('gulp-notify');  // エラー時に通知を出す

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
