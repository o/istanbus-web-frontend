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

var MapService = function () {
  var config = {
    defaultZoom: 8,
    stopDetailZoom: 15,
    maxZoom: 18,
    styleId: 998,
    tileLayerUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    cloudMadeApiKey: '5f9a0dab187a45cf8688a68cb55680a2',
    defaultLatLon: [0, 0],
    istanbulLatLon: [41.045311, 29.034548]
  }

  this.createMap = function () {
    var map = L.map('map');
    L.tileLayer(config.tileLayerUrl, {
      maxZoom: config.maxZoom,
      key: config.cloudMadeApiKey,
      styleId: config.styleId
    }).addTo(map);

    return map;
  }
}

angular.module('mapService', []).factory('MapService', function () {
  return new MapService();
})