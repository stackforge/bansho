'use strict';

angular.module('adagios.view.hosts', ['ngRoute',
                                      'adagios.table'
                                     ])

    .value('hostsConfig', {})

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hosts', {
            templateUrl: 'hosts/hosts.html',
            controller: 'HostsCtrl'
        });
    }])

    .controller('HostsCtrl', ['$scope', 'hostsConfig', function ($scope, hostsConfig) {
        $scope.hostsCellsText = hostsConfig.cellsText.join();
        $scope.hostsCellsName = hostsConfig.cellsName.join();
        $scope.hostsApiName = hostsConfig.apiName;
        $scope.hostsFilters = hostsConfig.filters;
    }])

    .run(['readConfig', 'hostsConfig', function (readConfig, hostsConfig) {
        hostsConfig.cellsText = readConfig.data.hostsConfig.cells.text;
        hostsConfig.cellsName = readConfig.data.hostsConfig.cells.name;
        hostsConfig.apiName = readConfig.data.hostsConfig.apiName;
        hostsConfig.filters = readConfig.data.hostsConfig.filters;
    }]);
