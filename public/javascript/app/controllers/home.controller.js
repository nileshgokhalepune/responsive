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
            $state.go('home.activity.maps');
        }


        function logout() {
            authSvc.signOut();
            $state.reload('home');
        }
    }

})();