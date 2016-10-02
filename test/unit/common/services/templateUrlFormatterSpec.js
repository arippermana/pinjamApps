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

describe('Unit: Template URL Formatter', function () {

    var template;

    beforeEach(function() {
        module('app.common');

        inject(function(_template_) {
            template = _template_;
        });
    });

    describe('#call(index.html, test)', function() {

        var result;

        beforeEach(function() {
            result = template.formatUrl('index.html', 'test');
        });

        it('should return a fixed URL for a static template', function() {
            expect(result).to.equal('/js/test/views/index.html');
        });

    });

});

