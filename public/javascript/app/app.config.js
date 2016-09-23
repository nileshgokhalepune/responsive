(function () {

    angular.module('dating').config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home', templateUrl: 'partials/home', controller: 'homeCtrl'
            })
        $stateProvider
            .state('home.activity', {
                views: {
                    'activity': {
                        template: '<div ui-view="" />'
                    }
                },
                abstract: true
            })
        $stateProvider
            .state('login', { templateUrl: 'partials/login', controller: 'loginCtrl' });

        $stateProvider
            .state('register', { templateUrl: 'partials/register', controller: 'registerCtrl' });

        $stateProvider
            .state('contact', {
                templateUrl: 'partials/contactus', controller: function () {
                }
            });
        $stateProvider
            .state('home.activity.profile', { templateUrl: 'partials/profile', controller: 'profileCtrl' });

        $stateProvider
            .state('home.activity.maps', { url: '/home/maps', templateUrl: 'partials/maps', controller: 'mapsCtrl' });
    });
})();