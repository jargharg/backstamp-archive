var gulp = require("gulp"),
	sass = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer")

gulp.task("styles", function() {
	return gulp
		.src("./app/assets/css/styles.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest("./app/temp/css"))
})
