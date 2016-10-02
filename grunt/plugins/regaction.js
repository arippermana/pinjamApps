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

'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

    grunt.registerTask('regaction', function(target) {

        var defaults = {
            regex_modifier: 'igm'
        };

        var config = grunt.config(this.name)[target];

        // Override defaults with environment specific options and possible arguments.
        // When an argument is undefined it wont override previously defined values.
        var options = _.defaults(config, defaults);
        grunt.log.debug('options', options);

        if (typeof options.action !== 'function' || _.isEmpty(options.regex) || _.isEmpty(options.files)) {
            grunt.log.error('regaction:' + target + ' is configured incorrectly. Please provide an action, a regex and files.');
            return;
        }

        var expandedFiles = [];
        _.forEach(options.files, function(file) {
            expandedFiles = expandedFiles.concat(grunt.file.expand(file));
        });

        var regex = new RegExp(options.regex, options.regex_modifier);
        var matchedFiles = _.filter(expandedFiles, function(file) {
            return grunt.file.read(file).match(regex);
        });

        var ignoredFiles = _.difference(expandedFiles, matchedFiles);

        config.action(matchedFiles, ignoredFiles);
    });

};
