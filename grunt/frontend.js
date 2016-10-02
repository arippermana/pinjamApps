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

var _ = require('lodash');

module.exports = function(grunt, config, paths) {
    config['imagemin'] = {
        all: {
            options: {
                optimizationLevel: 3,
                progressive: true
            },
            files: [
                {
                    expand: true,
                    cwd: paths['app_img'],
                    src: '**/*.{png,jpg,jpeg,gif,webp}',
                    dest: paths['app_img']
                }
            ]
        }
    };

    config['sass'] = {
        app: {
            files: [{
                expand: true,
                cwd: paths['app_scss'],
                src: ['*.scss'],
                dest: paths['tmp_css'],
                ext: '.css',
                noCache: true
            }]
        }
    };

    config['copy'] = _.extend({}, config['copy'], {
        frontend: {
            files: [{
                expand: true,
                dot: true,
                cwd: paths['app'],
                dest: paths['build'],
                src: [
                    '*.{ico,png,txt}',
                    '.htaccess',
                    'img/{,*/}*',
                    'fonts/{,*/}*'
                ]
            }, {
                expand: true,
                dot: true,
                cwd: paths['tmp'],
                dest: paths['build'],
                src: [
                    'index.html'
                ]
            }, {
                expand: true,
                dot: true,
                cwd: paths['tmp_css'],
                dest: paths['build_css'],
                src: [
                    '*.css'
                ]
            }, {
                expand: true,
                dot: true,
                cwd: paths['tmp_js'],
                dest: paths['build_js'],
                src: [
                    'modernizr-custom.js'
                ]
            }]
        }
    });

    config['filerev'] = _.extend({}, config['filerev'], {
        css: {
            src: [
                paths['build_css'] + '*.css'
            ]
        },
        fonts: {
            src: [
                paths['build_fonts'] + '**/*.{svg,eot,otf,ttf,woff}'
            ]
        },
        images: {
            src: [
                paths['build_img'] + '**/*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    });

    config['svg2png'] = {
        all: {
            files: [
                {
                    src: paths['app_img'] + '**/*.svg'
                }
            ]
        }
    };

    config['modernizr'] = {
        devFile: 'remote',
        outputFile: paths['tmp_js'] + 'modernizr-custom.js.tmp',
        files: [paths['app_js'] + '**/*.js', paths['app_scss'] + '**/*.scss'],
        parseFiles: true,
        extra: {
        'shiv' : true,
            'printshiv' : false,
            'load' : true,
            'mq' : false,
            'cssclasses' : true
        },
        extensibility: {
            'addtest' : false,
                'prefixed' : false,
                'teststyles' : false,
                'testprops' : false,
                'testallprops' : false,
                'hasevents' : false,
                'prefixes' : false,
                'domprefixes' : false
        }
    };

    config['smart_copy'] = {
        'modernizr': {
            'src': paths['tmp_js'] + 'modernizr-custom.js.tmp',
            'dest': paths['tmp_js'] + 'modernizr-custom.js'
        }
    };

    grunt.registerTask('smart-modernizr', ['modernizr', 'smart_copy:modernizr']);

    config['watch'] = _.extend({}, config['watch'], {
        imagemin: {
            files: paths['app_img'] + '**/*.{png,jpg,jpeg,gif,webp}',
            tasks: ['imagemin'],
            options: {
                event: ['added', 'changed'],
                livereload: true
            }
        },
        svg2png: {
            files: paths['app_img'] + '**/*.svg',
            tasks: ['svg2png'],
            options: {
                event: ['added', 'changed'],
                livereload: true
            }
        },
        sass: {
            files: [paths['app_scss'] + '**/*.scss'],
            tasks: ['sass:app', 'smart-modernizr']
        },
        csslivereload: {
            files: [paths['tmp'] + 'js/modernizr-custom.js', paths['tmp_css'] + '*.css'],
            options: {
                livereload: true
            }
        },
        index: {
            files: [paths['app'] + 'index.html'],
            tasks: ['copy:html', 'useminPrepare', 'fileblocks:app'],
            options: {
                livereload: true
            }
        }
    });

};

