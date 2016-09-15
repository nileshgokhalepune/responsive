(function () {
    'use strict';

    angular.module('dating').controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$state', 'authSvc', 'DataSvc'];

    function homeCtrl($scope, $state, authSvc, DataSvc) {
        $scope.matches = [];
        $scope.matchedUsers = [];
        $scope.showUsers = showUsers;
        $scope.logout = logout;
        $scope.countries = [];
        $scope.states = [];
        $scope.cities = [];
        activate();
        function activate() {
            if (!authSvc.isAuthenticated()) $state.go('login');
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

            DataSvc.getDistinctLocations('Country').then(function(response){
                if(response.data.success == true){
                    $scope.countries = response.data.countries;
                }
            },function(error){

            })
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