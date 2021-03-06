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

var app = app || {};
app.helpers = app.helpers || {};
app.helpers.mocks = app.helpers.mocks || {};
app.helpers.factories = app.helpers.factories || {};

app.helpers.trigger = function(el, type) {
    el = el instanceof jQuery ? el[0] : el;

    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent(
        type,
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
};

app.helpers.click = function(el) {
    app.helpers.trigger(el, 'click');
};

app.helpers.doEvent = function(element, event, callback) {
    var e = $.Event(event);
    if (typeof callback === 'function') {
        callback(e);
    }
    element.trigger(e);
};

app.helpers.doKeyDown = function(element, keyCode) {
    app.helpers.doEvent(element, 'keydown', function(event) {
        event.keyCode = keyCode;
    });
};

/**
 * It's possible that you are not sure if a method already has a spy on it or not.
 * This method checks first and if so, resets the spy. If not it just attaches a new spy.
 *
 * @param object The object on which the method is you want to spy on.
 * @param method The method you want to spy.
 */
app.helpers.spyIfNeeded = function(object, method) {
    if (typeof object[method].reset === 'function') {
        object[method].reset();
    } else {
        sinon.spy(object, method);
    }
};

/**
 * Inject a spy into the $broadcast method.
 *
 * @param $provide
 */
app.helpers.spyOnRootScopeBroadcast = function($provide) {
    $provide.decorator('$rootScope', function($delegate) {
        sinon.spy($delegate, '$broadcast');

        return $delegate;
    });
};

/**
 * Get the calls that were performed on this spy that pass the check callback.
 *
 * @param $spy {sinon.spy}
 * @param filter {Function} A callback that's passed each call. Return true if you want to include the call in the results.
 * @returns {Array}
 */
app.helpers.filterSpyCalls = function($spy, filter) {
    var calls = [], i, call;

    for(i =0; i < $spy.callCount; i++) {
        call = $spy.getCall(i);

        if (filter(call)) {
            calls.push(call);
        }
    }

    return calls;
};

/**
 * The templates are stored in the general module so we'll ensure we load it here.
 */
app.helpers.loadLocalTemplatesCache = function() {
    module('app.templates');
};

