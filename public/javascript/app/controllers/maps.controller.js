(function () {
    'use strict';

    angular.module('dating').controller('mapsCtrl', mapsCtrl);

    mapsCtrl.$inject = ['$scope', 'DataSvc', 'authSvc'];

    function mapsCtrl($scope, DataSvc, authSvc) {
        $scope.matches = [];
        $scope.matchedUsers = [];
        activate();

        function activate() {
            //check for all profiles nearby;
            DataSvc.checkmates().then(function (response) {
                $scope.matches = response.data;
            }, function (err) {
                if (err.status && err.status === 401) {
                    authSvc.signOut();
                    $state.go('login');
                }
                debugger;
            });

            DataSvc.getDistinctLocations('Country').then(function (response) {
                if (response.data.success == true) {
                    $scope.countries = response.data.countries;
                }
            }, function (error) {

            })
        }
    }

})();