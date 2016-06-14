angular.module('starter.controllers', [])

  .controller('MapCtrl', function ($scope, $ionicLoading, $cordovaGeolocation) {

    ionic.Platform.ready(function () {


      var loading = $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
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

          var mapOptions = {
            center: myLatlng,
            zoom: 11, // org=16
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
          };

          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
          var trafficLayer = new google.maps.TrafficLayer();
          trafficLayer.setMap(map);
          
          $scope.map = map;
          google.maps.event.addListenerOnce($scope.map, 'idle', function(){
          
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: myLatlng
            });      
          
          });

          loading.hide();
          console.log('Success, lat/lng: ', lat, long);
        }, function (error) {
          loading.hide();
          console.log(error);
        });

    });
  });
