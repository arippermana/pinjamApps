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

var _ = require('lodash'),
    path = require('path'),
    fs = require('fs');

module.exports = function(grunt, paths) {

    grunt.registerTask('kuma:config', 'Generate a configuration based on the current ENVIRONMENT', function(envTarget) {
        var env = envTarget || grunt.config('env');

        grunt.log.subhead('Generating config file for the ' + env + ' environment!');

        var files = grunt.file.expand(paths['app_js'] + '*');

        var config = {}, states = {};
        _.forEach(files, function(dir) {
            var module = path.basename(dir),
                configFile = path.resolve(dir, 'config', 'config.json'),
                stateFile = path.resolve(dir, 'config', 'states.json');

            if (fs.existsSync(configFile)) {
                _.merge(config, grunt.file.readJSON(configFile));
            }

            if (fs.existsSync(stateFile)) {
                _.merge(states, {states: _.mapValues(grunt.file.readJSON(stateFile), function(state) {
                    return _.extend({
                        'module': module
                    }, state);
                })});
            }

        });

        config = _.merge({}, states, config, grunt.file.readJSON(paths['app_config'] + 'config.json'), grunt.file.readJSON(paths['app_config'] + 'config_' + env + '.json'));

        var outputFile = paths['app_js'] + 'common/config/config.js',
            content = "'use strict';\n" +
                       "// ci:coverage:exclude\n\n" +
                       "angular.module('app.common')\n" +
                       "    .constant('config', " + JSON.stringify(config, null, 4) + ");";

        grunt.file.write(outputFile, content);
        grunt.log.ok('Generated ' + outputFile);
    });

};
