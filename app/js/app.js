var app = angular.module("app", ['istanbusServices']);

app.config(function($routeProvider, $locationProvider) {

  // allow html5 push state
  // $locationProvider.html5Mode(true);

  $routeProvider.when('/otobus-arama', {
    templateUrl: "otobus-arama.html",
    controller: "BusSearchController"
  });

  $routeProvider.when('/otobus/:id', {
    templateUrl: "otobus.html",
    controller: "BusController"
  });

  $routeProvider.otherwise({ redirectTo : '/otobus-arama' });
});