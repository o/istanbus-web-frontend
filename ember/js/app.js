App = Ember.Application.create({
  ready: function () {
    $(document).foundationAccordion();
    console.log('istanbus is ready');
  },
  LOG_TRANSITIONS: true
});

App.RESTSerializer = DS.RESTSerializer.extend({
  init: function() {
    this._super();
    this.map('App.Stop',{
      bus: {
        embedded: 'always'
      }
    });
  }
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: DS.RESTAdapter.extend({
    namespace: "api",
    serializer: App.RESTSerializer
  })
});

DS.RESTAdapter.configure("plurals", {
  bus : "bus",
  stop: "stop"
});

DS.RESTAdapter.registerTransform('geoPoint', {
  serialize: function(value) {
    return [value.get('latitude'), value.get('longitude')];
  },
  deserialize: function(value) {
    return Ember.create({ latitude: value[0], longitude: value[1] });
  }
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
App.StopSearch = Ember.Object.extend();
App.Bus = DS.Model.extend({
  name: DS.attr('string')
});

App.Stop = DS.Model.extend({
  name: DS.attr('string'),
  location: DS.attr('geoPoint'),
  bus: DS.hasMany('App.Bus', { embedded: 'always' })
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

App.StopRoute = Ember.Route.extend({
  model: function(params) {
    return App.Stop.find(params.stopId);
  }
});

// controllers
App.SearchController = Ember.Controller.extend({
  keyword: null,
  results : [],
  type: null,
  objectModel: null,
  search: function() {
    var results = [];
    var keyword = this.get('keyword');

    var url = "/api/search/" + this.type + "/" + keyword;
    $.ajax({
      url: url,
      dataType: 'json',
      context: this,
      success: function(response) {
        response.forEach(function(bus) {
          results.addObject(this.objectModel.create(bus));
        }, this)
      }
    });
    this.set('results', results);
  }
});

App.StopSearchController = App.SearchController.extend({
  objectModel: App.StopSearch,
  type: "stop"
});

App.BusSearchController = App.SearchController.extend({
  objectModel: App.BusSearch,
  type: "bus"
});

// views
App.AutoCompleteTextField = Ember.TextField.extend({
  classNames: ["twelve", "columns"],
  keyUp: function() {
    this.get('controller').search();
  }
})