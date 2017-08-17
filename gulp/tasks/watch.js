var gulp = require("gulp"),
	watch = require("gulp-watch"),
	browserSync = require("browser-sync").create()

gulp.task("watch", function(){
	browserSync.init({
		notify: false,
		server: {
			baseDir: "./app"
		}
	})
	
	watch("./app/index.html", function() {
		browserSync.reload()
	})
	
	watch("./app/assets/css/**/*.scss", function(){
		gulp.start("cssInject")
	})

	watch("./app/assets/js/**/*.js", function(){
		gulp.start("scriptsRefresh")
	})
})

gulp.task("cssInject", ["styles"], function(){
	browserSync.reload()
})

gulp.task("scriptsRefresh", ["scripts"], function(){
	browserSync.reload()
})