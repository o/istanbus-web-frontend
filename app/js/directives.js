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
          $location.path(attributes.routeOnClick);
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

app.directive('stringTemplate', function() {
  return {
    restrict: "A",
    link: function(scope, element, attributes) {
      scope.$watch("item", function(item, oldValue) {
        if (item) {
          var templateKey = attributes.stringTemplate;
          var tagMode = false;
          if (templateKey == "TAG") {
            tagMode = true;
            templateKey = element.prop('localName');
          }
          var template = scope._currentRoute[templateKey];
          if (template) {
            try {
              var rendered = sprintf(template, item);
            }
            catch(e) {
              console.log(e);
            }
            if (rendered) {
              if (tagMode) {
                element.text(rendered);
              }
              else {
                element.attr('content', rendered);
              }
            }
          }
        }
      }, true);
    }
  };
});