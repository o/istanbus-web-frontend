var app = angular.module("app");
app.directive('searchOnKeyUp', function(SearchService) {
  return {
    restrict: "A",
    link: function(scope, element, attributes) {
      scope.searchResults = [];
      element.bind('keyup', function() {
        var keywordField = attributes.ngModel;
        var keyword = scope[keywordField];
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

app.directive('navigationUrl', function($location) {
  return {
    restrict: "A",
    link: function(scope, element, attributes) {
      var clazz = "active";
      var path = attributes.navigationUrl;
      scope.location = $location;
      scope.$watch('location.path()', function(newPath) {
        if (path === newPath) {
          element.addClass(clazz);
        } else {
          element.removeClass(clazz);
        }
      });
    }
  };
});