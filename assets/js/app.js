function App () {

  var ajaxHandlers = {};
  var domBuilders = {};
  var partialViews = {};
  var helpers = {};
  var messages = {};
  
  var params = {
    apiEndpoint: 'http://host:port',
  };
  
  var routes = {
    search = {
      bus: function(id){return '/search/bus/' + id},
      stop: function(id){return '/search/stop/' + id}
    },
    solutions = {
      howtogo: function(from, to) {return '/howtogo/from/' + from + '/to/' +  to}
    },
    stop : {
      detail: function(id) {return '/stop/' + id},
      closest: function(lat, lon) {return '/closest/lat/' + lat + '/lon/' + lon}
    },
    bus: {
      detail: function(id) {return '/bus/' + id},
      timesheet: function(id) {return '/bus/' + id + '/timesheet'},
      stopsGo: function(id) {return '/bus/' + id + '/stops/go'},
      stopsCome: function(id) {return '/bus/' + id + '/stops/come'};
    }
  };

  this.init = function() {
    // initializer
  };

}

$.ajaxSetup({
  cache: false,
  dataType: 'json'
});

var app = new App();
app.init();