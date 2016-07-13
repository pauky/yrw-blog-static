/**
 * Author: pauky
 * Date: 2015/12/10
 * Verson: 0.1
 */
var gulp = require('gulp');
var cssMin = require('gulp-css');
var uglify = require('gulp-uglify')

// 压缩 css 文件
gulp.task('cssMinfy', function(){
  return gulp.src('assets/css/*.css')
    .pipe(cssMin())
    .pipe(gulp.dest('assets/css/'));
});

// 压缩 js 文件
gulp.task('script', function() {
  // 1. 找到文件
  gulp.src('assets/js/*.js')
    // 2. 压缩文件
    .pipe(uglify())
    // 3. 另存压缩后的文件
    .pipe(gulp.dest('assets/js/'))
});

// 图片资源
gulp.task('img', function() {
  // 1. 找到文件
  gulp.src('img/*')
    // 3. 另存压缩后的文件
    .pipe(gulp.dest('assets/'))
});

gulp.task('default', ['cssMinfy', 'script', 'img']);