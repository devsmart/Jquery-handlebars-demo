module.exports = function (grunt) {

    grunt.initConfig({
        distdir: 'public',
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            options: {force: true},
            stuff: ['<%= distdir %>/*', '!<%= distdir %>/bower_components']
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/js/data.js', 'app/js/**/*.js'],
                dest: '<%= distdir %>/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                },
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= distdir %>/js/<%= pkg.name %>.min.js': ['<%= distdir %>/js/<%= pkg.name %>.js']
                }
            }
        },
        copy: {
            css: {
                expand: true,
                src: ['**'],
                cwd: 'app/css/',
                dest: '<%= distdir %>/css/'
            },
           /* css: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: 'app/css/!*.css',
                dest: '<%= distdir %>/css/'
            },*/
            img: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: ['app/pics/*.jpg'],
                dest: '<%= distdir %>/pics/'
            },
            thirdParty:{
                src: 'app/3rdparty/*.*',
                dest: '<%= distdir %>/3rdparty',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            index:{
                src: 'app/index.html',
                dest: '<%= distdir %>',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
            /*favicon:{
             src: '../dev/open-vellum/app/img/favicon.ico',
             dest: '<%= distdir %>/favicon.ico'
             },
             config:{
             src: 'buildfiles/Web.config',
             dest: '<%= distdir %>/Web.config'
             }*/
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'app/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= distdir %>/css/',
                ext: '.min.css'
            }
        },
        jshint: {
            files: ['gruntfile.js', 'app/js/**/*.js'],
            options: {
                // options here to override JSHint defaults
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    strict: false
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        },
        bower: {
            install: {
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            }
        },
        exec: {
            bowerInstallOffline: 'bower install -o'
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "demoApp.templates"
                },
                files: {
                    '<%= distdir %>/js/templ.js':['app/templates/**/*.hbs']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-bower-task');
    //grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('templ', ['handlebars']);

//    grunt.registerTask('default', ['clean', 'jshint', 'qunit', 'concat', 'uglify']);

    grunt.registerTask('build', ['jshint', 'clean', 'concat', 'uglify', 'cssmin', 'handlebars', 'copy']);


};
