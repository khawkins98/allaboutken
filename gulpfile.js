const gulp = require('gulp');
const minify = require('gulp-minifier');
const panini = require('panini/gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const critical = require('critical');
const rename = require('gulp-rename');
const resizer = require('gulp-images-resizer');

gulp.task('panini', () => {
  return panini('src', {
    //   builtins: false,
    //   root: 'pages/',
    //   layouts: 'layouts/',
    //   partials: 'partials/',
    //   helpers: 'helpers/',
    //   data: 'data/'
    })
    .pipe(gulp.dest('build'));
});

// https://github.com/addyosmani/critical
gulp.task('critical', function() {
  return critical.generate({
    // inline: true,
    base: './',
    src: 'build/index.html',
    dest: 'src/partials/criticalmincss.html', // we use .html so we can do a panini include
    ignore: ['@font-face'],
    minify: true,
    dimensions: [{
      height: 200,
      width: 500
    }, {
      height: 900,
      width: 1200
    }]
  });
});

gulp.task('minify', function() {
  return gulp.src('build/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: false,
    minifyHTML: {
      collapseWhitespace: true,
      conservativeCollapse: true,
    },
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
      var m = content.match(/\/\*![\s\S]*?\*\//img);
      return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('build'));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      // proxy: "https://work.allaboutken.com",
      baseDir: 'build'
    }
  },function(){
    // something you want to do
  });
});

// process images
gulp.task('images', function(done) {

  // Copy of the original
  gulp.src('images/**/*.*')
    .pipe(gulp.dest('build/images/original/'));

  // Square crop
  gulp.src('images/**/*{.jpg,.png,.gif}')
    .pipe(resizer({
      // format: "png",
      width: 400,
      height: 400
    }))
    .pipe(gulp.dest('build/images/crop-square/'));

  // Cinematic crop
  gulp.src('./images/**/*{.jpg,.png,.gif}')
    .pipe(resizer({
      verbose: true,
      // format: "png",
      width: 900,
      height: 600
    }))
    .pipe(gulp.dest('build/images/crop-cinema/'))
    .on('end', done);

});

// empty out the build folder
gulp.task('clean:build', function () {
  return del([
    'build/**/*'
  ]);
});

// copy any static assets into the build root
gulp.task('static', function () {
  return gulp.src('./static/**/*')
    .pipe(gulp.dest('build'));
});
// p.watch();

// panini won't process .xml, so we work around
gulp.task('renameRss', function () {
  gulp.src("./build/rss.html")
    .pipe(rename("rss.xml"))
    .pipe(gulp.dest("./build"));
  return del([
    'build/rss.html'
  ]);
});

// refresh panini's helpers, templates
gulp.task('refresh', function (done) {
  // panini.refresh();
  panini.create();
  done();
  // gulp.start('panini');
});

gulp.task('refreshBrowser', function (done) {
  setTimeout(function() {
    browserSync.reload();
    done();
  }, 500); // wait for the filesystem to write
});

// watch task
gulp.task('watch', function(){
  gulp.watch(['./{src,static}/**/*'], 
    gulp.series('refresh', 'static', 'panini', 'renameRss', 'minify', 'refreshBrowser')
  );
});

// runner tasks
gulp.task('clean', gulp.series('clean:build')); // purge ./build
gulp.task('init', gulp.series('clean:build', 'images', 'static')); // empty ./build and then make images, add static asssets
gulp.task('dev', gulp.series('init', 'static', 'panini', 'minify', gulp.parallel('browser-sync', 'watch')));

// build static assets for deployment
gulp.task('build', 
  gulp.series('init', 'static', 'panini', 'critical', 'renameRss', 'minify')
); 

gulp.task('default', gulp.series('dev'));
