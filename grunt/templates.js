/*The MIT License

Copyright (c) 2014 Kunstmaan (http://www.kunstmaan.be)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

var _    = require('lodash'),
    path = require('path');

module.exports = function(grunt, config, paths) {

    config['ngtemplates'] = {
        'testing': {
            cwd: paths['app_js'],
            src: '**/views/**/**.html',
            dest: 'test/helpers/templates.cached.js',
            options: {
                module: 'app.templates',
                prefix: '/js/',
                standalone: true
            }
        },
        'build': {
            cwd: paths['app_js'],
            src: '**/views/**/**.html',
            dest: paths['tmp_js'] + 'templates.js',
            options: {
                prefix: '/js/',
                module : 'app',
                concatfix: 'dist/js/app.js', // used by templatesconcatfix task
                htmlmin: {
                    collapseBooleanAttributes:      false,
                    collapseWhitespace:             false,
                    removeAttributeQuotes:          false,
                    removeComments:                 true, // Only if you don't use comment directives!
                    removeEmptyAttributes:          false,
                    removeRedundantAttributes:      false,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                }
            }
        }
    };

    grunt.registerTask('templatesconcatfix', 'Fix to ensure template file is concatted', function() {
        // get build config
        var ngtemplateConfig = grunt.config('ngtemplates').build;

        // add this file to be uglified (saves a bit space)
        var uglifyConfig = grunt.config('uglify');
        var genUglifyConfig = uglifyConfig.generated;
        var uglifyFile = '.tmp/uglify/js/templates.js';
        genUglifyConfig.files.push({src : [ ngtemplateConfig.dest], dest: uglifyFile});
        // write this config back
        grunt.config('uglify', uglifyConfig);

        // now take the output of uglify and add it to the concat
        var concatConfig = grunt.config('concat');
        var generatedConcat = concatConfig.generated;
        for (var i = 0 ; i < generatedConcat.files.length ; i++) {
            var f = generatedConcat.files[i];
            if (f.dest === ngtemplateConfig.options.concatfix) {
                f.src.push(uglifyFile);
                // write new concat confi
                grunt.config('concat', concatConfig);
                // we're done!
                grunt.log.ok('Added ' + uglifyFile + ' to be concatted to ' + ngtemplateConfig.options.concatfix);
                break;
            }
        }

    });

    config['watch'] = _.extend({}, config['watch'], {
        templates: {
            files: [paths['app_js'] + '**/*.html'],
            tasks: ['modernizr', 'ngtemplates:testing'],
            options: {
                nospawn: true,
                livereload: true
            }
        }
    });

};
