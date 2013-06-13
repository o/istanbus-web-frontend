var app = angular.module("app", ['istanbusServices', 'mapService', 'app.providers']);

app.config(function($routeProvider, routeServiceProvider) {

  var RouteService = routeServiceProvider.$get();
  var routes = RouteService.getRoutes();
  for(var routeId in  routes) {
    var route = routes[routeId];
    $routeProvider.when(route.url, {
      templateUrl: route.template,
      controller: route.controller,
      _config: route
    });
  }
  $routeProvider.otherwise({ redirectTo : '/otobus-arama' });
});