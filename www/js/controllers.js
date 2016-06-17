angular.module('starter.controllers', [])

  .controller('MapCtrl', function ($scope, $ionicLoading, $cordovaGeolocation) {
    
    var marker = null;

    $scope.createTheMap = function() {
      console.log('createTheMap()');
          var mapOptions = {
            center: {lat: -34.397, lng: 150.644},
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
          };

          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
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
        .then(function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;

          var myLatlng = new google.maps.LatLng(lat, long);
          $scope.map.setCenter(myLatlng);

          var newMarker = new google.maps.Marker({
            map: $scope.map,
            animation: null,//google.maps.Animation.DROP,
            position: myLatlng
          });
          marker = newMarker;

          $ionicLoading.hide();
          console.log('Success, lat/lng: ', lat, long);

        }, function (error) {
          $ionicLoading.hide();
          console.log('Could not get position: ', error);
        });
    }

    $scope.refresh = function() {
      console.log('Refreshing...');
      $scope.createTheMap();
      $scope.centerOnMe();
    }

    ionic.Platform.ready(function () {

      // Start with refresh
      $scope.refresh();

    });
  });
