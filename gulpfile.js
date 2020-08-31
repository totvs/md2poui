const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;

// App
gulp.task('clean', () => require('del')('dist'));
gulp.task('copy', () => gulp.src(['package.json', 'README.md']).pipe(gulp.dest('dist')));
gulp.task('uglify', () => gulp.src('dist/**/*.js').pipe(uglify()).pipe(gulp.dest('dist')));

gulp.task('prebuild', gulp.series('clean'));
gulp.task('postbuild', gulp.series('copy'));

// Test
gulp.task('cleanTest', () => require('del')('test/result'));
gulp.task('pretest', gulp.series('cleanTest'));
