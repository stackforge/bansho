/*global jQuery */

'use strict';

angular.module('bansho.config', [])
    .service('themeManager', ['$rootScope', 'configManager',
            function ($rootScope, configManager) {
        var THEMES = {
            DARK: "dark",
            LIGHT: "light",
            DEFAULT: "dark"
        }

        var setThemeClass = function (theme, saveConfig) {
            $rootScope.themeClass = 'color-scheme--' + theme;
            $rootScope.themeColor = theme;

            if (saveConfig) {
                configManager.setThemeAndSave(theme);
            }
        };

        /**
         * Set the application theme from configManager
         *
         * If configManager isn't loaded this will set default.
         */
        this.setTheme = function () {
            var theme = configManager.getTheme()
            if (theme) {
                setThemeClass(theme, false);
            } else {
                setThemeClass(THEMES.DARK, false);
            }
        }

        this.switchTheme = function () {
            if ($rootScope.themeColor === THEMES.DARK) {
                setThemeClass(THEMES.LIGHT, true);
            } else {
                setThemeClass(THEMES.DARK, true);
            }
        }
    }])

    .service('configManager', ['$http', '$q', function ($http, $q) {
        var config = {},
            developmentConfig = {};

        this.loadDevelopmentConfig = function() {
            var promise = $q.defer();

            $http.get('components/config/developmentConfig.json')
                .success(function (config) {
                    developmentConfig = config;
                    promise.resolve();
                })
                .error(function() {
                    promise.reject();
                });

            return promise.promise;
        };

        this.getDevelopmentConfig = function () {
            return developmentConfig;
        };

        this.loadByTemplate = function (templateName, destination) {
            var viewsConfig = config.data;

            angular.forEach(viewsConfig, function (conf, view) {
                if (conf.template === templateName) {
                    destination[view] = conf;
                }
            });
        };

        this.readConfig = function () {
            return config.data;
        };

        this.setThemeAndSave = function (theme) {
           config.data.banshoConfig.theme = theme;
           saveConfig();
        };

        this.getTheme = function () {
            var theme;

            if (config.data) {
                theme = config.data.banshoConfig.theme;
            }

            return theme;
        };

        var setThemeClass = function (themeColor) {
            $rootScope.themeColor = themeColor;
            $rootScope.themeClass = 'color-scheme--' + themeColor;
        }
        var saveConfig = function () {
            var responsePromise = $q.defer();

            $http.post('surveil/v2/bansho/config', JSON.stringify(config.data))
                .success(function () {
                    responsePromise.resolve();
                })
                .error(function () {
                    responsePromise.reject('Failed to send config to server');
                });

            return responsePromise.promise;
        }

        this.fetchConfig = function (useStoredConfig) {
            var responsePromise = $q.defer();

            $http.get('surveil/v2/bansho/config')
                .success(function (conf) {
                    if (!useStoredConfig || jQuery.isEmptyObject(conf))  {

                        $http.get('components/config/config.json')
                            .success(function (conf) {
                                config.data = conf;

                                $http.post('surveil/v2/bansho/config', JSON.stringify(conf))
                                    .success(function () {
                                        responsePromise.resolve();
                                    })
                                    .error(function () {
                                        responsePromise.reject('Failed to send config to server');
                                    });
                            })
                            .error(function () {
                                responsePromise.reject('Failed to fetch default config');
                            });
                    } else {
                        config.data = conf;
                        responsePromise.resolve();
                    }
                })
                .error(function () {
                    responsePromise.reject('Failed to fetch config');
                });

                return responsePromise.promise;
            };
        }]);
