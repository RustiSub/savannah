(function() {
  'use strict';

  var gulp = require('gulp');
  var rename = require('gulp-rename');
  var { inlineSource } = require('inline-source');
  var inline = inlineSource;
  var htmlmin = require('gulp-htmlmin');
  var less = require('gulp-less');
  var zlib = require('zlib');
  var {readFileSync, writeFileSync} = require('fs');

  /**
   *
   */
  gulp.task('watch', ['gzip'], function() {
    gulp.watch('./*.js', ['gzip']);
    gulp.watch('./*.html', ['gzip']);
  });

  /**
   *
   */
  gulp.task('html'/*, ['css']*/, function (done) {
    let html = readFileSync('./index.html', 'utf8');
    inline(html, {
      compress: true
    }).then(function(output) {
      writeFileSync('./build/indexmin.html', output);
      done();
    });
  });

  gulp.task('gzip', ['html'], function(done){
    var src = readFileSync('./build/indexmin.html', 'utf8');
    // Get rid of all extra script tags and replace them by ';' to fix minified code and save size.
    src = src.split('</script><script>').join(';');
    var template = readFileSync('./index_compressed_template.html', 'utf8');
    var data = zlib.gzipSync(src, {
      level: 9,
      windowBits: 15
    });
    data = data.toString('base64');
    writeFileSync('./build/index.html', template.replace('{$BUFFER}', data).replace('{$BUFFER_SIZE}', src.length));
  //  fs.unlinkSync('./build/indexmin.html');
    return done();
  });

  gulp.task('build', ['gzip']);

  /**
   * @param err
   */
  function handleError(err) {
    var gutil = require('gulp-util');

    gutil.log(gutil.colors.red(err));
    this.emit('end');
  }

}());