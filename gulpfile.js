'use strict';

const gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cleanCSS = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  del = require('del'),
  browsersync = require("browser-sync");


const path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};


// конфиг сервера

const srvConfig = {
    server: {
        baseDir: "./build"
    },
    // tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_k2a"
};

// BrowserSync

function browserSync(done) {
  browsersync.init(srvConfig);

  done();

}

// BrowserSync Reload

function browserSyncReload(done) {
  browsersync.reload();

  done();
}


// таск для сборки html

function html() {
  return gulp
      .src(path.src.html)
      .pipe(rigger())
      .pipe(gulp.dest(path.build.html))
      .pipe(browsersync.stream())
}

// таск для сборки scss

function styles() {
  return gulp
      .src(path.src.style)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(browsersync.stream())
}


// таск для сборки js

function scripts() {
  return gulp
      .src(path.src.js)
      .pipe(rigger())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.js))
      .pipe(browsersync.stream())
}

// таск для сборки img

function img() {
  return gulp
      .src(path.src.img)
      .pipe(imagemin({
                  progressive: true,
                  svgoPlugins: [{removeViewBox: false}],
                  use: [pngquant()],
                  interlaced: true
              }))
      .pipe(gulp.dest(path.build.img))
      .pipe(browsersync.stream())
}

// таск для сборки fonts:

function fonts() {
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browsersync.stream())
}


// таск для clean

function clean() {
  return del(path.clean);
}


function watchFiles() {
  gulp.watch(path.watch.html,gulp.series(html, browserSyncReload));
  gulp.watch(path.watch.style,gulp.series(styles, browserSyncReload));
  gulp.watch(path.watch.js,gulp.series(scripts, browserSyncReload));
  gulp.watch(path.watch.img,gulp.series(img, browserSyncReload));
  gulp.watch(path.watch.fonts,gulp.series(fonts, browserSyncReload));
}


const build = gulp.series(clean, gulp.parallel(html,styles,scripts,img,fonts));
const watch_p = gulp.parallel(watchFiles, browserSync);
const images = gulp.series(img);
const bnw = gulp.series(build, watch_p);

exports.images = images;
exports.clean = clean;
exports.html= html;
exports.watch= watch_p;
exports.build = build;
exports.bnw = bnw;
