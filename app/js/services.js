var app = angular.module("app");

var istanbusServices = angular.module('istanbusServices', ['ngResource']);
istanbusServices.factory('SearchService',
    function($resource) {
      return $resource('/api/search/:index/:keyword', {}, {
        search: {
          method: 'GET',
          params: {
            index: 'bus',
            keyword: 'taksim'
          },
          isArray:true
        }
      });
    }
);

istanbusServices.factory('BusService', function($resource) {
      return $resource('/api/bus/:id');
    }
);

istanbusServices.factory('StopService', function($resource) {
      return $resource('/api/stop/:id');
    }
);

istanbusServices.factory('StopService', function($resource) {
      return $resource('/api/stop/:id');
    }
);

istanbusServices.factory('PathSearchService', function($resource) {
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

istanbusServices.factory('ClosestStopSearchService', function($resource) {
    return $resource('/api/closest/lat/:lat/lon/:lng', {}, {
      search: {
        method: 'GET',
        params: {
          lat: 41.045311,
          lng: 29.034548
        },
        isArray:true
      }
    });
    }
);