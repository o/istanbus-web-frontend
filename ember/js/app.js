App = Ember.Application.create({
  ready: function () {
    console.log('istanbus is ready');
  },
  LOG_TRANSITIONS: true
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: DS.RESTAdapter.extend({
    namespace: "api"
  })
});

DS.RESTAdapter.configure("plurals", {
  bus : "bus"
});

App.Router.map(function() {
  this.resource('busSearch', {path : "/otobus-arama"});
  this.resource('stopSearch', {path : "/durak-arama"});
  this.resource('pathSearch', {path : "/nasil-giderim"});
  this.resource('closestStops', {path : "/en-yakin-duraklar"});
  this.resource('bus', { path: '/otobus/:busId' });
  this.resource('stop', { path: '/durak/:stopId' });
});

// models
App.BusSearch = Ember.Object.extend();
App.Bus = DS.Model.extend({
  name: DS.attr('string')
});

// routes
App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    // redirect index to bus search
    this.transitionTo('busSearch');
  }
});

App.BusRoute = Ember.Route.extend({
  model: function(params) {
    return App.Bus.find(params.busId);
  }
});

// controllers
App.BusSearchController = Ember.Controller.extend({
  keyword: null,
  results : [],
  search: function() {
    var results = [];
    var keyword = this.get('keyword');

    $.ajax({
      url: "/api/search/bus/" + keyword,
      dataType: 'json',
      context: this,
      success: function(response) {
        response.forEach(function(bus) {
          results.addObject(App.BusSearch.create(bus));
        }, this)
      }
    });
    this.set('results', results);
  }
});

// views
App.AutoCompleteTextField = Ember.TextField.extend({
  keyUp: function() {
    this.get('controller').search();
  }
})