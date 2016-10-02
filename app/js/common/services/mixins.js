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

/**
 * @note
 *  first idea was to handle this at state and context configuration level, but resolve and so doesn't has the scope variable so it didn't work
 */
angular.module('app.common')
    .factory('mixins', ['$injector', function($injector) {

        return function($scope, mixins) {
            if (arguments.length <= 2) {
                if (!_.isArray(mixins)) {
                    mixins = [mixins];
                }
            } else {
                mixins = Array.prototype.slice.call(arguments, 1, arguments.length);
            }

            var i = 0;
            for (; i < mixins.length; i++) {
                (typeof mixins[i] === 'string' ? $injector.get(mixins[i] + (app.endsWith(mixins[i], 'Mixin') ? '' : 'Mixin')) : $injector.invoke(mixins[i]))($scope);
            }
        };

    }]);
