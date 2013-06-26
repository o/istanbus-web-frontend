var app = angular.module("app", ['istanbusServices', 'mapService', 'app.providers', 'ngCookies']);

app.config(function($routeProvider, routeServiceProvider, $locationProvider) {

  $locationProvider.hashPrefix('!');

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

app.run(function($rootScope, GA, $cookies) {
  if (!$cookies.istanbusBot)
  {
    // init google analytics
    GA.init($cookies);
  }
  $rootScope.$on('$routeChangeSuccess', function(scope, current, pre) {
    $rootScope._currentRoute = current._config;
  });
});