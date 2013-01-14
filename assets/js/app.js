function App () {
  
  var onLoadHandlers = {};
  var ajaxHandlers = {};
  var domBuilders = {};
  var partialViews = {};
  var helpers = {};  
  var messages = {};
  
  var params = {
    apiEndpoint: 'http://178.79.173.195:8000',
  };
  
  var routes = {
    search: {
      bus: function(id){return params.apiEndpoint + '/search/bus/' + id},
      stop: function(id){return params.apiEndpoint + '/search/stop/' + id}
    },
    solutions: {
      howtogo: function(from, to) {return params.apiEndpoint + '/howtogo/from/' + from + '/to/' +  to}
    },
    stop: {
      detail: function(id) {return params.apiEndpoint + '/stop/' + id},
      closest: function(lat, lon) {return params.apiEndpoint + '/closest/lat/' + lat + '/lon/' + lon}
    },
    bus: {
      detail: function(id) {return params.apiEndpoint + '/bus/' + id},
      timesheet: function(id) {return params.apiEndpoint + '/bus/' + id + '/timesheet'},
      stopsGo: function(id) {return params.apiEndpoint + '/bus/' + id + '/stops/go'},
      stopsCome: function(id) {return params.apiEndpoint + '/bus/' + id + '/stops/come'}
    }
  };

  this.init = function() {
    pageType = $('body').data('page-type');
    if (onLoadHandlers[pageType]) {
      onLoadHandlers[pageType].call();
    }
    onLoadHandlers.post();    
  };
  
  onLoadHandlers.post = function() {
    //
  };
    
  onLoadHandlers.searchStop = function() {
    ajaxHandlers.searchStop();
  };
  
  ajaxHandlers.searchStop = function() {
    $('#stopKeyword').keyup(function(event) {
      if (event.which == 13) {
        event.preventDefault();
      }
      var keyword = $(this).val().trim();
      $.get(routes.search.stop(keyword), domBuilders.searchStop);  
      }
    );
  };
  
  domBuilders.searchStop = function(results) {
    if (results.length > 0) {
      $('#stopResults').html('<div id="resultList"></div>');
      $.each(results, function(index, val) {
        $('#resultList').append(partialViews.stopResult(val));
      });
    };
  };

  partialViews.stopResult = function(json) {
    return '<div class="resultListElement" data-id="' + json.id + '">' + json.name + '</div>'
  };

}

$.ajaxSetup({
  cache: false,
  dataType: 'json'
});

var app = new App();
app.init();