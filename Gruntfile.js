module.exports = function (grunt) {

    var multiLineParser = function (type, i, line, block) {
        // find the next instance of a parser (if there is one based on the @ symbol)
        // in order to isolate the current multi-line parser
        var nextParserIndex = block.indexOf('* @', i+1),
            length = nextParserIndex > -1 ? nextParserIndex - i : block.length,
            newBlock = block.split('').splice(i-1, length).join('');
            newBlock = (function(newBlock){
                var ret = [], lines = newBlock.split('\n');
                lines.forEach(function(line){
                    var pattern = '*', index = line.indexOf(pattern);
                    if (index !== -1 && index <= (type.length + 4)) { line = line.split('').splice((index + pattern.length), line.length).join(''); }
                    line = line.replace(new RegExp('^\\s+?@' + type + '\\s+'), '').replace(/\s+$/,'');
                    if (line.match(new RegExp('.*@' + type + '\\s*$'))) { ret.push(''); return; }
                    if (line) { ret.push(line); }
                });
                return ret.join('\n> ');
            })(newBlock);
        return newBlock;
    };

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
        clean: ['dist/*'],
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            plugin: {
                src: [
                    'package.json',
                    'Gruntfile.js',
                    'src/plugin/**/*.js'
                ]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>' + '!(function ($, window) {\n\n',
                footer: '\n})(jQuery, window);\n'
            },
            build: {
                src: 'src/plugin/**/*.js',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        sed: {
            plugin: {
                path: 'dist',
                pattern: '%DEFAULT_OPTIONS%',
                replacement: grunt.file.read('src/defaultOptions.js'),
                recursive: true
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
        },
        watch: {
            source: {
                files: [
                    'package.json',
                    'Gruntfile.js',
                    'src/**/*.js'
                ],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        },
        dss: {
            docs: {
                files: {
                    docs: 'src/defaultOptions.js'
                },
                options: {
                    template: 'docs/templates/',
                    template_index: 'jsdoc2md.handlebars',
                    output_index: '/options.md',
                    parsers: {
                        "default": function(i, line, block) { return multiLineParser('default', i, line, block); },
                        example: function (i, line, block) { return multiLineParser('example', i, line, block); },
                        description: function (i, line, block) { return multiLineParser('description', i, line, block); },
                        optional: function () { return true; },
                        type: function (i, line) { return line; }
                    }
                }
            }
        }
    });

    // Load the grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dss');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-verb');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'jshint', 'concat', 'sed', 'uglify', 'dss', 'verb']);

};
