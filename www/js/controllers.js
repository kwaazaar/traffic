angular.module('starter.controllers', [])

    .controller('MapCtrl', ['$scope', '$ionicLoading', '$cordovaGeolocation', 'storage',
        function($scope, $ionicLoading, $cordovaGeolocation, storage) {

            var marker = null;

            $scope.createTheMap = function() {
                
                // Loading last position
                var lastPos = new google.maps.LatLng(
                  storage.LoadData('lastPos.lat') || -34.397,
                  storage.LoadData('lastPos.lng') || 150.644);
                var lastZoomLevel = storage.LoadData('lastZoomLevel') || 11;

                console.log('lastPos: ', lastPos);

                console.log('createTheMap()');
                var mapOptions = {
                    center: lastPos,
                    zoom: lastZoomLevel,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true
                };

                var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                map.addListener('center_changed', function() {
                  var newCenter = $scope.map.getCenter();
                  storage.SaveData('lastPos.lat', newCenter.lat());
                  storage.SaveData('lastPos.lng', newCenter.lng());
                });
                map.addListener('zoom_changed', function() {
                  var newZoom = $scope.map.getZoom();
                  storage.SaveData('lastZoomLevel', newZoom);
                });
                
                var trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);
                $scope.map = map;
            }

            $scope.centerOnMe = function() {
                console.log('centerOnMe()');

                // Remove existing marker
                if (marker !== null) {
                    marker.setMap(null);
                    marker = null;
                }

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location...'
                });

                var posOptions = {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                };

                $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function(position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;

                        var myLatlng = new google.maps.LatLng(lat, long);
                        $scope.map.setCenter(myLatlng);
                        $scope.map.setZoom(11);

                        var newMarker = new google.maps.Marker({
                            map: $scope.map,
                            animation: null,//google.maps.Animation.DROP,
                            position: myLatlng
                        });
                        marker = newMarker;

                        $ionicLoading.hide();
                        storage.SaveData('lastPos.lat', lat);
                        storage.SaveData('lastPos.lng', long);
                        console.log('Success, lat/lng: ', lat, long);

                    }, function(error) {
                        $ionicLoading.hide();
                        console.log('Could not get position: ', error);
                    });
            }

            $scope.refresh = function() {
                console.log('Refreshing...');
                $scope.createTheMap();
                //$scope.centerOnMe();
            }

            ionic.Platform.ready(function() {
                // Start with refresh
                $scope.refresh();
            });
        }]);
