app.controller("SearchController", function ($scope) {
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

app.controller("ClosestStopSearchController", function ($scope, ClosestStopSearchService) {
  var map = L.map('map').setView([0, 0], 8);
  L.tileLayer("http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png", {
    maxZoom: 18,
    key: "5f9a0dab187a45cf8688a68cb55680a2",
    styleId: 998
  }).addTo(map);

  map.locate({setView:true, enableHighAccuracy:true, maxZoom: 18});
  map.on('locationfound', function(payload) {
    var location = payload.latlng;
    L.circle(location, payload.accuracy / 2).addTo(map);
    L.popup().setLatLng(location).setContent("Buradasiniz.").openOn(map);
    $scope.searchResults = ClosestStopSearchService.search({
      latitude: location.lat,
      longitude: location.lng
    });
  });
});

app.controller("PathSearchController", function($scope, $location) {
  $scope.fromKeyword = "";
  $scope.toKeyword = "";

  $scope.fromStop = null;
  $scope.toStop = null;

  $scope.searchMode = "from" || "to";

  $scope.selectStop = function(stop) {

    var searchMode = $scope.searchMode;
    $scope[searchMode + "Stop"] = stop;
    $scope[searchMode + "Keyword"] = stop.name;

    var fromStop = $scope.fromStop;
    var toStop = $scope.toStop;
    if (fromStop && toStop)
    {
      var resultPage = '/nasil-giderim/nerden/' + fromStop.id +'/nereye/' + toStop.id;
      $location.path(resultPage);
    }
  };

  $scope.setMode = function(mode) {
    $scope[mode + "Stop"] = null;
    $scope.searchMode = mode;
  };

  $scope.hasNoResult = function () {
    return $scope.getCurrentKeyword() && $scope.searchResults.length == 0;
  };

  $scope.showStopResults = function() {
    return $scope.getCurrentStop() == null && $scope.getCurrentKeyword().length > 0 && $scope.searchResults.length > 0;
  };

  $scope.getCurrentKeyword = function() {
    var searchMode = $scope.searchMode;
    return $scope[searchMode + 'Keyword'];
  };

  $scope.getCurrentStop = function() {
    var searchMode = $scope.searchMode;
    return $scope[searchMode + 'Stop'];
  };

});

app.controller("PathSearchResultController", function ($scope, $routeParams, PathSearchService, StopService) {
  $scope.fromStop = StopService.get({id: $routeParams.fromStopId});
  $scope.toStop = StopService.get({id: $routeParams.toStopId});

  $scope.pathSearchResult = PathSearchService.search({
    fromStopId : $routeParams.fromStopId,
    toStopId: $routeParams.toStopId
  });
});