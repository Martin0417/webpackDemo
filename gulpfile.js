var gulp = require('gulp');
var md5 = require('gulp-md5-plus');
var clean =  require('gulp-clean');
var htmlMin = require('gulp-htmlmin');
var replace = require('gulp-html-replace');
var runSequence = require('gulp-sequence');

console.info('----------------------------------------------------------------------------------------------------------------------');
console.info('-----------------------------start gulp to copy html , md5 js、css in html,minfiy html--------------------------------');
console.info('----------------------------------------------------------------------------------------------------------------------');

gulp.task('copyHtml',function(done){
    return gulp.src('src/html/**/*.html')
        .pipe(gulp.dest('dist_build/html/'));
});

gulp.task('replace',function(done){
    return gulp.src('dist_build/html/**/*.html')
        .pipe(replace({
            js:{
                src:'dist_build',
                tpl:'<script src="/%s/js/%f.entry.js"></script>'
            },
            css:{
                src:'dist_build',
                tpl:'<script src="/%s/css/%f.entry.css"></script>'
            },
            keepBlockTags:false
        }))
        .pipe(gulp.dest('dist_build/html'));
});

gulp.task('md5:js', function (done) {
    return gulp.src('dist_build/js/*.entry.js')
        .pipe(md5(10, 'dist_build/html/**/*.html'))
        .pipe(gulp.dest('dist_build/js'));
});

gulp.task('md5:css', function (done) {
    return gulp.src('dist_build/css/*.entry.css')
        .pipe(md5(10, 'dist_build/html/**/*.html'))
        .pipe(gulp.dest('dist_build/css'));
});

gulp.task('cleanOriginEntryFile',function(){
    gulp.src(['dist_build/css/*.entry.css','dist_build/js/*.entry.js']).pipe(clean());
});

gulp.task('htmlMin',function(){
    return gulp.src('dist_build/html/**/*.html')
        .pipe(htmlMin({collapseWhitespace: true,removeComments:true}))
        .pipe(gulp.dest('dist_build/html'));
});

gulp.task('build',function(cb){
    runSequence('copyHtml','replace',['md5:js','md5:css'],'cleanOriginEntryFile','htmlMin',cb);
});