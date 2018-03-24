"use strict";

var browserSync = require("browser-sync").create();

browserSync.init({
    files: ["public/css/*.css","public/js/**/*.*","public/*.html", "public/partials/**/*.html", "public/3rdparty/*.*"],
    server: {
        baseDir: "public"
    }
});