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