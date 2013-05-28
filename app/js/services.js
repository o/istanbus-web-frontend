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
    return $resource('/api/closest/lat/:latitude/lon/:longitude', {}, {
      search: {
        method: 'GET',
        params: {
          latitude: 41.045311,
          longitude: 29.034548
        },
        isArray:true
      }
    });
    }
);