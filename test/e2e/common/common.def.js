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

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var util = require("./util.js");
var pageConfirm = require("./common.page.js");


/**
 * Util functions to check for links / click on links / going to states.
 */
module.exports = function() {

    this.Given(/^I am on state "([^"]*)"\s*(\(.*\))?$/, function(state, regexp, next) {
        if (regexp && regexp.length > 2) {
            regexp = regexp.substr(1, regexp.length - 2); // strip ( ... )
        }
        util.goToState(state, regexp).then(function() {
            next();
        });
    });

    this.When(/^I click(\son)?\sthe link "([^"]*)"$/, function(optParam,linkName,next) {
        element(by.linkText(linkName)).click();
        next();
    });

    this.When(/^I click(\son)?\sthe button "([^"]*)"$/, function(optParam,linkName,next) {
        element(by.buttonText(linkName)).click();
        next();
    });

    this.When(/^I enter "([^"]*)" into "([^"]*)\s\((.*)\)"$/, function(text,name,identifier,next) {
        element(util.locateBy(identifier)).sendKeys(text);
        next();
    });

    this.When(/^I clear "([^"]*)\s\((.*)\)"$/, function(name, identifier, next) {
        element(util.locateBy(identifier)).clear();
        next();
    });

    this.When(/^I select "([^"]*)" from the dropdown "([^"]*)"$/, function(selectValue, dropdownIdentifier, next) {
        var found = false;
        var foundOption;
        element(util.locateBy(dropdownIdentifier)).element.all(by.tagName("option")).then(function(arr) {
            arr.some(function(option) {
                option.getText().then(function(value) {
                    if (value === selectValue) {
                        found = true;
                        foundOption = option;
                    }
                });
            });
        }).then(function() {
            expect(found).to.be.true;
            foundOption.click();
            next();
        });
    });
    ;
    this.Then(/^I should see the link "([^"]*)"$/, function(linkName, next) {
        expect(element(by.linkText(linkName)).isDisplayed()).to.eventually.equal(true);
        next();
    });

    this.Then(/^I should see the button "([^"]*)"$/, function(linkName, next) {
        expect(element(by.buttonText(linkName)).isDisplayed()).to.eventually.equal(true);
        next();
    });

    this.Then(/^the "([^"]*)" button should be enabled$/, function(name,next) {
        expect(element(by.buttonText(name)).isEnabled()).to.eventually.equal(true);
        next();
    });

};

