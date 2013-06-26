var istanbusServices = angular.module('istanbusServices', ['ngResource']);
istanbusServices.factory('SearchService', function ($resource) {
      return $resource('/api/search/:index/:keyword', {}, {
        search: {
          method: 'GET',
          params: {
            index: 'bus',
            keyword: 'taksim'
          },
          isArray: true
        }
      });
    }
);

istanbusServices.factory('BusService', function ($resource) {
      return $resource('/api/bus/:id');
    }
);

istanbusServices.factory('StopService', function ($resource) {
      return $resource('/api/stop/:id');
    }
);

istanbusServices.factory('StopService', function ($resource) {
      return $resource('/api/stop/:id');
    }
);

istanbusServices.factory('PathSearchService', function ($resource) {
      return $resource('/api/path/from/:fromStopId/to/:toStopId', {}, {
        search: {
          method: 'GET',
          params: {
            fromStopId: "taksim-beyoglu",
            toStopId: "horhor-uskudar"
          }
        }
      });
    }
);

istanbusServices.factory('ClosestStopSearchService', function ($resource) {
      return $resource('/api/closest/lat/:lat/lon/:lng', {}, {
        search: {
          method: 'GET',
          params: {
            lat: 41.045311,
            lng: 29.034548
          },
          isArray: true
        }
      });
    }
);

var MapService = function ($http) {
  L.Icon.Default.imagePath = "/app/images"
  var $http = $http;
  var config = {
    defaultZoom: 8,
    stopDetailZoom: 15,
    maxZoom: 18,
    styleId: 998,
    tileLayerUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    cloudMadeApiKey: '5f9a0dab187a45cf8688a68cb55680a2',
    defaultLatLon: [0, 0],
    istanbulLatLon: [41.045311, 29.034548]
  };

  this.createMap = function () {
    var map = L.map('map');
    L.tileLayer(config.tileLayerUrl, {
      maxZoom: config.maxZoom,
      key: config.cloudMadeApiKey,
      styleId: config.styleId
    }).addTo(map);

    return map;
  };

  this.routing = function(from, to) {
    var cloudMadeRouteUrl = 'http://routes.cloudmade.com/' + config.cloudMadeApiKey + '/api/0.3/' + from + ',' + to + '/foot.js?callback=JSON_CALLBACK';
    return $http.jsonp(cloudMadeRouteUrl);
  };

  this.addStopMarkersToMap = function(stops, map, releventLocation) {
    releventLocation = new L.LatLng(releventLocation[0], releventLocation[1]);

    var locations = [];
    for (var i in stops) {
      var stop = stops[i];
      var locationResult = stop.location;

      var location = new L.LatLng(locationResult[0], locationResult[1]);
      var distance = Math.round(releventLocation.distanceTo(location));
      if (distance > 0)
      {
        var label = stop.name + '</br>(Yaklaşık ' + distance + ' m)'
        L.marker(locationResult).addTo(map).bindPopup(label);

        locations.push(location);
      }
    }
    var bounds = new L.LatLngBounds(locations);
    map.fitBounds(bounds);
  };
}

angular.module('mapService', []).factory('MapService', function ($http) {
  return new MapService($http);
});

var Route = function(url, template, controller, labels) {
  this.url = url;
  this.template = template;
  this.controller = controller;
  this.item = null;

  for (var key in labels) {
    var label = labels[key];
    this[key] = label;
  }

  this.setItem = function(item) {
    this.item = item;
  }

  this.getTitle = function() {
    var title = this["title"];
    var item = this.item;
    if (item) {
      title = sprintf(title, item);
    }
    return title;
  };
}

var RouteService = function() {
  var routes = {
    "busSearch" : new Route("/otobus-arama", "otobus-arama.html", "SearchController", {
      "title" : "iett otobüs arama - istanbus"
    }),
    "busDetail" : new Route("/otobus/:id", "otobus.html", "BusController", {
      "title" : "%(id)s %(name)s hattı",
      "description" : "iett %(id)s %(name)s sefer saatleri, geçtiği duraklar, iett otobüs saatleri, ido seferleri, iett otobüs durakları, otobüs saatleri, oraya nasıl giderim ve istanbul ulaşım çözümleri.",
      "keywords" : "iett, %(id)s, %(name)s sefer saatleri, geçtiği duraklar, ido, iett otobüs arama, otobüs saatleri, otobüs durakları, istanbul otobüs, istanbul ulaşım, oraya nasıl giderim, durak arama, en yakın durak"
    }),
    "stopSearch" : new Route("/durak-arama", "durak-arama.html", "SearchController", {
      "title" : "iett, ido durak arama - istanbus"
    }),
    "stopDetail" : new Route("/durak/:id", "durak.html", "StopController", {
      "title" : "iett %(name)s durağından geçen otobüsler",
      "description" : "iett %(name)s durağından geçen otobüsler(hatlar), iett otobüs saatleri, ido seferleri, iett otobüs durakları, otobüs saatleri, oraya nasıl giderim ve istanbul ulaşım çözümleri.",
      "keywords" : "iett, %(name)s, %(name)s durağı, %(busString)s sefer saatleri, geçtiği duraklar, ido, iett otobüs arama, otobüs saatleri, otobüs durakları, istanbul otobüs, istanbul ulaşım, oraya nasıl giderim, durak arama, en yakın durak"
    }),
    "closestStop" : new Route("/en-yakin-durak", "en-yakin-durak.html", "ClosestStopSearchController", {
      "title" : "iett en yakın durak - istanbus"
    }),
    "pathSearch" : new Route("/nasil-giderim", "nasil-giderim.html", "PathSearchController", {
      "title" : "iett nasıl giderim ? - istanbus"
    }),
    "pathSearchResult" : new Route("/nasil-giderim/nerden/:fromStopId/nereye/:toStopId",
        "nasil-giderim-sonuc.html", "PathSearchResultController", {
          "title" : "iett nasıl giderim ? sonuclar - istanbus"
        })
  };

  this.getRoutes = function() {
    return routes;
  };

  this.getDefaultRoute = function() {
    return routes["busSearch"];
  }
}
// providers
var providers = angular.module('app.providers', []);

var routeService = new RouteService();
providers.provider('routeService', function() {
  this.$get = function() {
    return routeService;
  }
});

providers.provider('GA', function () {
  this.$get = function() {
    return {
      init: function() {
        if (navigator.userAgent == "istanbusSSR") {
          // ignore istanbus server side renderer
          return;
        }
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-38712116-1']);
        _gaq.push(['_trackPageview']);

        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
      }
    }
  }
});