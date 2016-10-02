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

module.exports = function(grunt, paths) {

    grunt.registerTask('kuma:e2eStateConfig', 'Generate a state configuration to be read by the e2e integration tests', function() {
        var stateFiles = grunt.file.expand({}, paths['app_js'] + '*/config/states.json'), states = {};
        for (var i = 0; i < stateFiles.length; i++) {
            _.merge(states, {states: grunt.file.readJSON(stateFiles[i])});
        }

        var outputFile = paths['test_e2e'] + '/common/states.generated.json',
            content = JSON.stringify(states, null, 4);

        grunt.file.write(outputFile, content);
        grunt.log.ok('Generated ' + outputFile);
    });

};