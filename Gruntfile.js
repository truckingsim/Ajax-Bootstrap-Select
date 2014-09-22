module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        banner: '/*!\n' +
        ' * <%= pkg.title || pkg.name %>\n *\n' +
        ' * <%= pkg.description %>\n *\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * @author <%= pkg.author.name %> - <%= pkg.author.url %>\n' +
        '<%= pkg.homepage ? " * @link " + pkg.homepage + "\\n" : "" %>' +
        ' * @copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
        ' * @license Released under the <%= _.pluck(pkg.licenses, "type").join(", ") %> license.\n *\n' +
        ' * Contributors:' +
        '<% _.forEach(pkg.contributors, function(contributor) {%>\n *   <%= contributor.name %> - <%= contributor.url %><% }); %>\n *\n' +
        ' * Last build: <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT Z") %>\n' +
        ' */\n',
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            main: {
                src: [
                    'package.json',
                    'Gruntfile.js',
                    'src/**/*.js'
                ]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>' + '!(function ($, window) {\n\n',
                footer: '\n})(jQuery, window);\n'
            },
            build: {
                src: 'src/**/*.js',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-verb');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'verb']);

};
