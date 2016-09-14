(function () {

    'use strict';

    angular.module('dating').service('authSvc', authSvc);

    authSvc.$inject = ['$http', '$log'];

    function authSvc($http, $log) {
        var service = this;
        service.login = login;
        service.getToken = getToken;
        service.signOut = signOut;
        
        service.isAuthenticated = isAuthenticated;
        service.user = {};
        function login(loginInfo, cb) {
            $http({
                url: '/auth/login',
                data: loginInfo,
                method: 'POST'
            }).then(function (response) {
                if (response.data.success) {
                    setAuth(response.data);
                    cb(true);
                }
            });
        }


        function setAuth(data) {
            window.localStorage['token'] = data.token;
            $http.defaults.headers.common.Authorization = "Bearer " + data.token;
            service.user = data.user;
        }

        function getToken() {
            return window.localStorage['token'];
        }

        function isAuthenticated() {
            if (window.localStorage['token'])
                return true;
            return false;
        }

        function signOut() {
            if (window.localStorage['token'])
                window.localStorage.removeItem('token');
        }
    }

})();