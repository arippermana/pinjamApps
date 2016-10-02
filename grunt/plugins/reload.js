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

var http = require('http');

/**
 * Custom task to reload the web app. We created this one so that this could be done async while our tests are running.
 * @TODO: not sure we still need this
 */
module.exports = function(grunt) {

	grunt.registerTask('reload', function() { // task so that we can manually trigger reload and so that it happens async with other tasks @todo maybe check grunt concurrent
        var done = this.async(),
            config = grunt.config(this.name);

            console.log(config);

        var data = '{ "files": ["app.js"] }',
            req = http.request({
                'host': 'localhost',
                'port': config.port,
                'path': '/changed',
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length
                }
            }, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    grunt.log.debug('BODY: ' + chunk);
                });

                done();
            });

        req.on('error', function(e) {
            grunt.log.error('problem with request: ' + e.message);

            done();
        });

        req.end(data);
    });

};