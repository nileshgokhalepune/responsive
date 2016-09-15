(function () {
    'use strict';

    angular.module('dating').service('DataSvc', dataSvc);
    dataSvc.$inject = ['$http'];

    function dataSvc($http) {
        this.getLocations = getLocations;
        this.registerUser = registerUser;
        this.isNameAvailable = isNameAvailable;
        this.checkEmailExists = checkEmailExists;
        this.checkmates = checkmates;
        this.getUserInfo = getUserInfo;
        this.getDistinctLocations = getDistinctLocations;

        function getLocations(searchText) {
            return $http({
                url: '/api/locations/find/' + searchText,
                method: 'GET'
            });
        }

        function registerUser(userInfo) {
            return $http({
                url: '/api/user/save',
                method: 'POST',
                data: { userInfo: userInfo }
            });
        }

        function isNameAvailable(name) {
            return $http({
                url: '/api/user/exists/' + name,
                method: 'GET'
            });
        }

        function checkEmailExists(email) {
            return $http({
                url: '/api/user/email/exists/' + email,
                method: 'GET'
            });
        }

        function checkmates() {
            return $http({
                url: '/api/matches',
                method: 'GET'
            });
        }

        function getUserInfo() {
            return $http({
                url: '/api/userInfo',
                method: 'GET'
            });
        }


        function getDistinctLocations(type) {
            return $http({
                url: '/api/distictplaces/' + type,
                method: 'GET'
            });
        }
    }
})();