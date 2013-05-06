var app = angular.module("app");
app.directive('searchOnKeyUp', function(SearchService) {
  return {
    restrict: "A",
    link: function(scope, element, attributes) {
      element.bind('keyup', function() {
        var keyword = scope.keyword;
        if (keyword.length == 0) return;
        scope.searchResults = SearchService.search({
          index: attributes.searchIndex,
          keyword: keyword
        });
      })
    }
  };
});

app.directive('routeOnClick', function($location) {
  return {
    restrict: "A",
    link: function(scope, element, attributes) {
      element.bind('click', function() {
        // When an event outside of angular('click' event) need to change inside of angular
        // the changes should occur inside of scope.$apply
        scope.$apply(function(){
          $location.path(attributes.routeUrl);
        });
      });
    }
  };
});