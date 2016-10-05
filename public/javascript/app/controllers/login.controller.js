(function () {
    'use strict';

    angular.module('dating').controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$state', 'authSvc', 'toastr'];

    function loginCtrl($scope, $state, authSvc, toastr) {
        $scope.position;
        $scope.loginInfo = {};
        var mapOptions = {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        // activate();

        // function activate() {
        //     debugger;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.$apply(function () {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.latitude);
                    $scope.position = position;
                    mapOptions.center = latlng; //new google.maps.LatLng(position.coords.latitude, position.coords.latitudelatitude);
                    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                    $scope.createMarker(latlng);
                    //google.maps.event.trigger(map, 'resize');
                });
            });
        }
        //}


        $scope.createMarker = function (info) {
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: info
                //title: info.city
            });

            marker.content = "<div class='infoWindow'>Current Locatio</div>";
        }

        $scope.login = function () {
            authSvc.login($scope.loginInfo, function (result) {
                if (result) {
                    toastr.success("Lets rock");
                    $state.go('home');
                } else {
                    toastr.error("Login failed");
                }
            });
        }

        $scope.navigateTo = function () {
            $state.go('register')
        }

        $scope.getLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.showPosition);
            } else {
                //show a message
                toastr.error('Geolocation is not supported by this browser');
            }
        }

        $scope.showPosition = function (position) {
            toastr.success("Latitude: " + position.coords.latitude + " <br>Longitude: " + position.coords.longitude);
        }
    }
})();