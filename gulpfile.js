var gulp = require("gulp"),
    minifycss = require("gulp-minify-css"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    less = require("gulp-less");

//编译less并压缩
gulp.task("lessTask", function() {
    gulp.src("./less/*.less")
        .pipe(less())
        .pipe(minifycss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("less/css/"));
});

//压缩js代码
gulp.task("jsTask", function() {
    gulp.src("./js/*.js")
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./js/min"));
})

//监听文件改动并执行指定任务
gulp.task("watchTask", function() {
    gulp.watch("./less/*.less", ["lessTask"]);
    gulp.watch("./js/*.js", ["jsTask"])
});


gulp.task("default", ["watchTask", "lessTask", "jsTask"], function() {
    console.log("default finish");
});