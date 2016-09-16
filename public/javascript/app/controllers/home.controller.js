(function () {
    'use strict';

    angular.module('dating').controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$state', 'authSvc', 'DataSvc'];

    function homeCtrl($scope, $state, authSvc, DataSvc) {
       
        $scope.showUsers = showUsers;
        $scope.logout = logout;
        $scope.countries = [];
        $scope.states = [];
        $scope.cities = [];
        activate();
        function activate() {
            if (!authSvc.isAuthenticated()) $state.go('login');
            $state.go('home.maps');
        }

        function showUsers(location) {
            $scope.matches.forEach(function (val) {
                if (val.Type === location.Type) {
                    $scope.matchedUsers = val.Users;
                    location.clicked = true;
                }
            });
        }

        function logout() {
            authSvc.signOut();
            $state.reload('home');
        }
    }

})();