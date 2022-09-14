import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import rename from 'gulp-rename';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import terser from 'gulp-terser';
import htmlmin from 'gulp-htmlmin';

// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//Images

const images = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

//WebP

const createWebP = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'));
}

//SVG

const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))
}

//HTML

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
}

//Copy

const copy = (done) => {
  gulp.src([
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done()
}

const copyImages = (done) => {
  gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
  done()
}

const copyFonts = (done) => {
  gulp.src('source/fonts/*.{woff2,woff}')
    .pipe(gulp.dest('build/fonts'))
  done()
}

//Scripts

export const minimizeScripts = (done) => {
  gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
  done()
}

//Clean

const clean = () => {
  return del('build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

//Build

export const build = gulp.series(
  clean,
  html,
  copy,
  copyFonts,
  minimizeScripts,
  images,
  gulp.parallel(
    createWebP,
    sprite,
    svg,
    styles,
  ),
);


export default gulp.series(
  clean,
  html,
  copy,
  copyFonts,
  minimizeScripts,
  copyImages,
  gulp.parallel(
    createWebP,
    sprite,
    svg,
    styles,
  ),
  gulp.series(
    server,
    watcher
  ));
