app.controller("SearchController", function ($scope) {
  $scope.searchResults = [];
  $scope.keyword = "";

  $scope.hasNoResult = function () {
    return $scope.keyword.length > 0 && $scope.searchResults.length == 0;
  };

});

app.controller("BusController", function ($scope, $routeParams, BusService) {
  $scope.bus = BusService.get({id: $routeParams.id});
  $scope.key = "stops";
  $scope.currentData = null;

  $scope.$watch('bus', function (bus, oldValue) {
    $scope.refreshTable();
  }, true);

  var _getNested = function(key, object) {
    var keys = key.split('.');
    return object[keys[0]][keys[1]];
  };

  $scope.refreshTable = function() {
    var key = $scope.key;
    var currentData = $scope.currentData = key.indexOf('.') == -1 ? $scope.bus[key] : _getNested(key, $scope.bus);
    if (currentData) {
      var go = currentData.go;
      var turn = currentData.turn;

      if (go.length == turn.length || (go.length == 0 && turn.length == 0)) {
        return;
      }
      var smaller = go.length < turn.length ? go : turn;
      currentData.max = smaller == go ? turn : go;

      var diff = Math.abs(go.length - turn.length);
      for (var i = 0; i < diff; i++) {
        smaller.push(null);
      }
    }

  };

  $scope.$watch('key', function(key, oldValue) {
    $scope.refreshTable();
  });

  $scope.isActive = function(key) {
    return $scope.key == key;
  }
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

  $scope.gettingLocation = true;
  $scope.myLocation = null;
  $scope.map = null;
  $scope.locationFound = false;
  $scope.locationError = false;
  $scope.accuracy = 0;

  $scope.initMap = function() {
    var map = $scope.map = L.map('map').setView([0, 0], 8);
    L.tileLayer("http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png", {
      maxZoom: 18,
      key: "5f9a0dab187a45cf8688a68cb55680a2",
      styleId: 998
    }).addTo(map);

    map.locate({setView:true, enableHighAccuracy:true, maxZoom: 18});
    map.on('locationfound', function(payload) {
      $scope.gettingLocation = false;
      $scope.locationFound = true;
      $scope.accuracy = payload.accuracy;

      var location = payload.latlng;
      var myLocation = $scope.myLocation = [location.lat, location.lng];
      L.circle(location, payload.accuracy / 2).addTo(map);
      L.popup().setLatLng(location).setContent("Buradasiniz.").openOn(map);

      map.setView(myLocation, 15);
      $scope.searchResults = ClosestStopSearchService.search(location);
    });

    map.on('locationerror', function(payload) {
      $scope.locationError = true;
      $scope.gettingLocation = false;
      map.setView([41.03842, 28.98705], 18);
    });
  }

  $scope.$watch('searchResults', function (searchResults, oldValue) {
    if (searchResults && searchResults.length > 0) {
      var myLocation = $scope.myLocation;
      myLocation = new L.LatLng(myLocation[0], myLocation[1]);

      var map = $scope.map;

      var locations = [];
      for (var i in searchResults) {
      	var result = searchResults[i];
        var locationResult = result.location;

        var location = new L.LatLng(locationResult[0], locationResult[1]);
        locations.push(location);

        var distance = Math.round(myLocation.distanceTo(location));
        L.marker(locationResult).addTo(map).bindPopup(result.name + '</br>(Yaklaşık ' + distance + ' m)');
      }

      var bounds = new L.LatLngBounds(locations);
      map.fitBounds(bounds);
    }
  }, true);

  $scope.initMap();
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
