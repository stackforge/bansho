'use strict';

describe('Sidebar module', function () {

    beforeEach(module('adagios.sidebar'));

    describe('SideBarCtrl', function () {

        it('should be defined', inject(function ($controller) {
            var scope, ctrl;
            scope = {};
            ctrl = $controller('SideBarCtrl', { $scope : scope });

            expect(ctrl).toBeDefined();
        }));

    });
});
