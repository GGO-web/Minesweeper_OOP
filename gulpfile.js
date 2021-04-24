const { src, dest, parallel, series, watch } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify-es").default;
const del = require("del");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const svgSprite = require("gulp-svg-sprite");
const fileInclude = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const htmlmin = require("gulp-htmlmin");
const gulpif = require("gulp-if");
const notify = require("gulp-notify");
const image = require("gulp-image");
const concat = require("gulp-concat");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");

let isRelease = false; // dev by default

const clean = () => {
   return del(["app/*"]);
};

const svgSprites = () => {
   return src("./src/img/svg/**.svg")
      .pipe(
         svgSprite({
            mode: {
               stack: {
                  sprite: "../sprite.svg", //sprite file name
               },
            },
         })
      )
      .pipe(dest("./app/img"));
};

const styles = () => {
   return src("./src/scss/**/*.scss")
      .pipe(gulpif(!isRelease, sourcemaps.init()))
      .pipe(sass().on("error", notify.onError()))
      .pipe(
         autoprefixer({
            cascade: false,
         })
      )
      .pipe(gulpif(isRelease, cleanCSS({ level: 2 })))
      .pipe(gulpif(!isRelease, sourcemaps.write(".")))
      .pipe(dest("./app/css/"))
      .pipe(browserSync.stream());
};

const scripts = () => {
   src("./src/js/**.js")
      .pipe(gulpif(isRelease, uglify().on("error", notify.onError())))
      .pipe(dest("./app/js/"));
   src("./src/js/vendor/**.js")
      .pipe(concat("vendor.js"))
      .pipe(gulpif(isRelease, uglify().on("error", notify.onError())))
      .pipe(dest("./app/js/"));

   return src(["./src/js/modules/**.js",
               "./src/js/script.js"])
      .pipe(gulpif(!isRelease, sourcemaps.init()))
      .pipe(concat("script.js"))
      .pipe(gulpif(isRelease, uglify().on("error", notify.onError())))
      .pipe(gulpif(!isRelease, sourcemaps.write(".")))
      .pipe(dest("./app/js"))
      .pipe(browserSync.stream());
};

const fonts = () => {
   return src("./src/fonts/*.{otf,ttf,woff,woff2}")
      .pipe(dest("./app/fonts/"))
      .pipe(src("./src/fonts/*.{otf,ttf,woff,woff2}"))
      .pipe(ttf2woff())
      .pipe(dest("./app/fonts/"))
      .pipe(src("./src/fonts/*.{otf,ttf,woff,woff2}"))
      .pipe(ttf2woff2())
      .pipe(dest("./app/fonts/"));
};

const resources = () => {
   return src("./src/resources/**").pipe(dest("./app/resources"));
};

const images = () => {
   return src(["./src/img/**/*.jpg",
               "./src/img/**/*.png",
               "./src/img/**/*.jpeg",
               "./src/img/**/*.svg",
               "./src/img/**/*.ico"])
      .pipe(gulpif(isRelease, image()))
      .pipe(dest("./app/img"));
};

const htmlInclude = () => {
   return src(["./src/*.html"])
      .pipe(
         fileInclude({
            prefix: "@",
            basepath: "@file",
         })
      )
      .pipe(dest("./app"))
      .pipe(browserSync.stream());
};

const watchFiles = () => {
   browserSync.init({
      server: {
         baseDir: "./app",
      },
   });

   watch("./src/scss/**/*.scss", styles);
   watch("./src/js/**/*.js", scripts);
   watch("./src/components/*.html", htmlInclude);
   watch("./src/*.html", htmlInclude);
   watch("./src/resources/**", resources);
   watch("./src/img/*.{jpg,jpeg,png,svg,ico}", images);
   watch("./src/img/sprite/**.svg", svgSprite);
};

const htmlMinify = () => {
   return src("app/**/*.html")
      .pipe(
         htmlmin({
            collapseWhitespace: true,
         })
      )
      .pipe(dest("app"));
};

const toRelease = (done) => {
   isRelease = true;
   done();
};

exports.default = series(clean, htmlInclude, scripts, styles, fonts, resources, images, svgSprites, watchFiles);
exports.build = series(toRelease, clean, htmlInclude, scripts, styles, fonts, resources, images, svgSprites, htmlMinify);
