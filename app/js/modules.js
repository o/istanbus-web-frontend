var app = angular.module("app");

var istanbusServices = angular.module('istanbusServices', ['ngResource']);
istanbusServices.factory('SearchService', function ($resource) {
      return $resource('/api/search/:index/:keyword', {}, {
        search: {
          method: 'GET',
          params: {
            index: 'bus',
            keyword: 'taksim'
          },
          isArray: true
        }
      });
    }
);

istanbusServices.factory('BusService', function ($resource) {
      return $resource('/api/bus/:id');
    }
);

istanbusServices.factory('StopService', function ($resource) {
      return $resource('/api/stop/:id');
    }
);

istanbusServices.factory('StopService', function ($resource) {
      return $resource('/api/stop/:id');
    }
);

istanbusServices.factory('PathSearchService', function ($resource) {
      return $resource('/api/path/from/:fromStopId/to/:toStopId', {}, {
        search: {
          method: 'GET',
          params: {
            fromStopId: "taksim-beyoglu",
            toStopId: "horhor-uskudar"
          }
        }
      });
    }
);

istanbusServices.factory('ClosestStopSearchService', function ($resource) {
      return $resource('/api/closest/lat/:lat/lon/:lng', {}, {
        search: {
          method: 'GET',
          params: {
            lat: 41.045311,
            lng: 29.034548
          },
          isArray: true
        }
      });
    }
);

var MapService = function ($http) {
  var $http = $http;
  var config = {
    defaultZoom: 8,
    stopDetailZoom: 15,
    maxZoom: 18,
    styleId: 998,
    tileLayerUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    cloudMadeApiKey: '5f9a0dab187a45cf8688a68cb55680a2',
    defaultLatLon: [0, 0],
    istanbulLatLon: [41.045311, 29.034548]
  };

  this.createMap = function () {
    var map = L.map('map');
    L.tileLayer(config.tileLayerUrl, {
      maxZoom: config.maxZoom,
      key: config.cloudMadeApiKey,
      styleId: config.styleId
    }).addTo(map);

    return map;
  };

  this.routing = function(from, to) {
    var cloudMadeRouteUrl = 'http://routes.cloudmade.com/' + config.cloudMadeApiKey + '/api/0.3/' + from + ',' + to + '/foot.js?callback=JSON_CALLBACK';
    return $http.jsonp(cloudMadeRouteUrl);
  };

  this.addStopMarkersToMap = function(stops, map, releventLocation) {
    releventLocation = new L.LatLng(releventLocation[0], releventLocation[1]);

    var locations = [];
    for (var i in stops) {
      var stop = stops[i];
      var locationResult = stop.location;

      var location = new L.LatLng(locationResult[0], locationResult[1]);
      var distance = Math.round(releventLocation.distanceTo(location));
      if (distance > 0)
      {
        var label = stop.name + '</br>(Yaklaşık ' + distance + ' m)'
        L.marker(locationResult).addTo(map).bindPopup(label);

        locations.push(location);
      }
    }
    var bounds = new L.LatLngBounds(locations);
    map.fitBounds(bounds);
  };
}

angular.module('mapService', []).factory('MapService', function ($http) {
  return new MapService($http);
})