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

/**
 * Utils that can be used in every def.js file.
 * Just import them using node's require syntax.
 */

var states = require("./states.generated.json").states;
module.exports = {};

module.exports.waitOnUrl = function(urlRegexp) {
    return browser.wait(function() {
        return browser.getCurrentUrl().then(function(url) {
            return urlRegexp.test(url);
        });
    }, 5000, 'Taking too long waiting on URL');
};

module.exports.locateBy = function(identifier) {
    var locator;
    if (identifier.indexOf("#") === 0) {
        // is an id
        locator = by.id(identifier.substring(1)); // remove # sign
    } else if (identifier.indexOf(".") === 0) {
        locator = by.class(identifier.substring(1)); // remove . sign
    } else {
        // is a model
        locator = by.model(identifier);
    }
    return locator;
};

module.exports.escapeRegExp = function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

/**
 * Move to a specific state.
 *
 * @param state string is the full name of the state.
 * @param regexp RegEx is optional.
 */
module.exports.goToState = function(state, regexp) {
    if (!states[state]) {
        throw new Error("State '" + state + "' not found.");
    }
    var url = "#" + states[state].path;
    browser.get(url);
    var r = new RegExp(module.exports.escapeRegExp(url) + "$");
    if (regexp) {
        r = new RegExp(regexp);
    }
    return module.exports.waitOnUrl(r);
}

