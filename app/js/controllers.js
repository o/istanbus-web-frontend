app.controller("BusSearchController", function($scope, $location) {
  $scope.searchResults = [];
  $scope.keyword = "";

  $scope.hasNoResult = function() {
    return $scope.keyword.length > 0 && $scope.searchResults.length == 0;
  };

  $scope.routeBus = function(busId) {
    $location.path('/otobus/' + busId);
  }
});

app.controller("BusController", function($scope, $routeParams, BusService) {
  $scope.bus = BusService.get({id: $routeParams.id});
});