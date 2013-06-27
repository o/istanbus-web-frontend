var app = angular.module("app", ['istanbusServices', 'mapService', 'app.providers']);

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

  var defaultRoute = RouteService.getDefaultRoute();
  $routeProvider.otherwise({ redirectTo : defaultRoute.url });
});

app.run(function($rootScope, GA) {
  // init google analytics
  GA.init();

  $rootScope.$on('$routeChangeSuccess', function(scope, current, pre) {
    $rootScope._currentRoute = current._config;
    GA.trackPage();
  });
});