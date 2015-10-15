'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var jsonlint = require('gulp-jsonlint');
var s3 = require('s3');

gulp.task('default', ['test']);

gulp.task('deploy', ['test'], function (callback) {

    var client = s3.createClient({
        s3Options: {
            accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
            secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY
        }
    });

    var uploader = client.uploadFile({
        localFile: './public/zoo-footer.json',
        ACL: 'public-read',
        CacheControl: 'max-age=3600',
        s3Params: {
            Bucket: 'zooniverse-static',
            Key: 'zoo-footer/zoo-footer.json'
        }
    });

    gutil.log('Uploading to ' + gutil.colors.red('zooniverse-static/zoo-footer') + '...');

    uploader.on('error', function (error) {
        gutil.log('Unable to sync: ' + error.stack);
    });

    uploader.on('end', function () {
        callback();
    });

});

gulp.task('test', function () {
    return gulp.src('./public/zoo-footer.json')
        .pipe(jsonlint())
        .pipe(jsonlint.failOnError());
});
