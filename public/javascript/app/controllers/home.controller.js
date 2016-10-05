(function () {
    'use strict';

    angular.module('dating').controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$state', 'authSvc', 'DataSvc'];

    function homeCtrl($scope, $state, authSvc, DataSvc) {

        $scope.logout = logout;
        $scope.countries = [];
        $scope.states = [];
        $scope.cities = [];
        activate();
        function activate() {
            if (!authSvc.isAuthenticated()) {
                $state.go('login');
                return;
            }

            DataSvc.getDistinctLocations('Country').then(function (response) {
                if (response.data.success == true) {
                    $scope.countries = response.data.data;
                }
            }, function (error) {

            });
            
            $state.go('home.activity.maps');
        }

        function logout() {
            authSvc.signOut();
            $state.go('login');
        }
    }

})();