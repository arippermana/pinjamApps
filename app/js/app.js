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
 * Define all the modules and their dependencies here ... config/run phase is done in the <module_name>/<module_name>.js file.
 */
angular.module('app.common', []);
angular.module('app.home', ['ui.router']);
angular.module('app.login', ['ui.router']);
angular.module('app.signup', ['ui.router']);
angular.module('app.postAds', ['ui.router']);

angular.module('app', ['app.home', 'app.login', 'app.signup', 'app.postAds', 'app.common', 'ngSanitize', 'ngAnimate', 'ui.router', 'svgPng'])
    .value('version', '0.1')
    .config(['config', '$httpProvider', '$stateProvider', '$urlRouterProvider', 'template',
        function(config, $httpProvider, $stateProvider, $urlRouterProvider, template) {
            var _states = config['states'], _defaultPath = '/',
                _registerState = function(name, stateConfig) {

                    var resolve = {}, options, locals;

                    // extension for our resolvers functionality
                    if (typeof stateConfig.resolve !== 'undefined') {
                        angular.forEach(stateConfig.resolve, function(value, key) {
                            var resolveFn;

                            // by default if only a string is given it will inject,
                            // else if an object is given without inject property or the inject property is set to false
                            // it will return the value property of the object
                            if (typeof value === 'string' || (value.hasOwnProperty('inject') && value.inject === true)) {
                                resolveFn = ['$injector', '$stateParams', function($injector, $stateParams) {
                                    return $injector.get(value)($stateParams);
                                }];
                            } else {
                                resolveFn = function() {
                                    return value['value'];
                                };
                            }

                            resolve[key] = resolveFn;
                        });
                    }

                    options = {
                        'stateName': name,
                        'templateUrl': template.formatUrl(stateConfig.templateUrl, stateConfig.module),
                        'url': stateConfig.path,
                        'abstract': typeof stateConfig['abstract'] !== 'undefined' && stateConfig['abstract'] ? true : false,
                        'strict': false,
                        'resolve': resolve
                    };

                    // extension that will apply the mixins to the controller scope
                    if (angular.isDefined(stateConfig.controller)) {
                        locals = ['$scope', '$controller', 'mixins', '$stateParams'].concat(_.keys(resolve));
                        options.controller = locals.concat(function($scope, $controller, mixins) {
                            var i = 0, localsObj = {};

                            for (;i < locals.length; i++) {
                                localsObj[locals[i]] = arguments[i];
                            }

                            if (angular.isArray(stateConfig.mixins)) {
                                mixins($scope, stateConfig.mixins);
                            }

                            $controller(stateConfig.controller, localsObj);
                        });
                    }

                    // If views are defined pass them along as default in the UI-Router,
                    // except also add the default templateUrl & controller as the logic
                    // to be placed in the parent's unnamed ui-view.
                    if (typeof stateConfig.views !== 'undefined') {
                        var views = {
                            '': {
                                'templateUrl': options.templateUrl,
                                'controller': options.controller
                            }
                        };
                        delete(options.controller);
                        delete(options.templateUrl);

                        angular.forEach(stateConfig.views, function(view) {
                            view.templateUrl = template.formatUrl(view.templateUrl, stateConfig.module);
                        });
                        views = angular.extend(views, stateConfig.views);
                        options.views = views;
                    }

                    $stateProvider.state(name, options);
                };

            angular.forEach(_states, function(state, stateName) {
                if (state['default']) {
                    _defaultPath = state.path;
                }

                _registerState(stateName, state);
            });

            // Redirect all urls not associated to a recognized state to the root URL.
            $urlRouterProvider
                .otherwise(_defaultPath);

        }])
    .run(['$rootScope', 'mixins',
        function($rootScope, mixins) {

            mixins($rootScope, 'templateUrlFormat');

        }]);

