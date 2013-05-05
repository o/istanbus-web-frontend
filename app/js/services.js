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

istanbusServices.factory('BusService',
    function($resource) {
      return $resource('/api/bus/:id');
    }
);