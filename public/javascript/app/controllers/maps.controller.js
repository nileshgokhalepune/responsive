(function () {
    'use strict';

    angular.module('dating').controller('mapsCtrl', mapsCtrl);

    mapsCtrl.$inject = ['$scope', 'DataSvc', 'authSvc'];

    function mapsCtrl($scope, DataSvc, authSvc) {
        $scope.showUsers = showUsers;
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
        }
        
        function showUsers(location) {
            $scope.matches.forEach(function (val) {
                if (val.Type === location.Type) {
                    $scope.matchedUsers = val.Users;
                    location.clicked = true;
                }
            });
        }
    }

})();