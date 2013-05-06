app.controller("SearchController", function ($scope, $location) {
  $scope.searchResults = [];
  $scope.keyword = "";

  $scope.hasNoResult = function () {
    return $scope.keyword.length > 0 && $scope.searchResults.length == 0;
  };

});

app.controller("BusController", function ($scope, $routeParams, BusService) {
  $scope.bus = BusService.get({id: $routeParams.id});
});

app.controller("StopController", function ($scope, $routeParams, StopService) {
  $scope.stop = StopService.get({id: $routeParams.id});

  $scope.$watch('stop', function (newValue, oldValue) {
    $scope.initMap(newValue);
  }, true);

  $scope.initMap = function (stop) {
    if (!stop.location) {
      return;
    }
    var location = {
      lat: stop.location[0],
      lng: stop.location[1]
    };
    var map = $scope.map = L.map('map').setView(location, 15);
    L.tileLayer("http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png", {
      maxZoom: 18,
      key: "5f9a0dab187a45cf8688a68cb55680a2",
      styleId: 998
    }).addTo(map);

    L.Util.requestAnimFrame(map.invalidateSize, map, false, map._container);
    L.marker(location).addTo(map).bindPopup(stop.name);
  }

});