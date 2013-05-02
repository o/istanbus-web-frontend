function App () {
  
  var onLoadHandlers = {};
  var ajaxHandlers = {};
  var domBuilders = {};
  var partialViews = {};
  var helpers = {}; 
  var messages = {
    youAreHere: 'Buradasınız.'
  };   
  var params = {
    apiEndpoint: 'http://api.istanbus.org',
    defaultZoom: 8,
    stopDetailZoom: 15,
    maxZoom: 18,
    styleId: 998,
    tileLayerUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    cloudMadeApiKey: '5f9a0dab187a45cf8688a68cb55680a2',
    defaultLatLon: [0,0],
    istanbulLatLon: [41.045311,29.034548]
  };
  var map;
  var mapLayers = {
    ui: {
      marker: {},
      popup: {}
    },
    vector: {
      circle: {}
    }
  }
  var routes = {
    search: {
      bus: function(id){return params.apiEndpoint + '/search/bus/' + id},
      stop: function(id){return params.apiEndpoint + '/search/stop/' + id}
    },
    solutions: {
      howtogo: function(from, to) {return params.apiEndpoint + '/path/from/' + from + '/to/' +  to}
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
    },
    misc: {
      routing: function(from, to) {return 'http://routes.cloudmade.com/' + params.cloudMadeApiKey + '/api/0.3/' + from + ',' + to + '/foot.js?callback=?'}
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
    helpers.clearInputsWhenFocused();
  };
    
  onLoadHandlers.searchStop = function() {
    ajaxHandlers.searchStop();
    helpers.initializeMap();
  };
  
  onLoadHandlers.closestStop = function() {
    helpers.initializeMap();
    helpers.locateUser();
  };
  
  onLoadHandlers.searchBus = function() {
    ajaxHandlers.searchBus();
    $(document).foundationAccordion();
  };

  onLoadHandlers.howToGo = function() {
    ajaxHandlers.searchFromStop();
    ajaxHandlers.searchToStop();
  };
  
  ajaxHandlers.searchFromStop = function() {
    $('#fromStopKeyword').keyup(function(event) {
      if (event.which == 13) {
        event.preventDefault();
      }
      var keyword = $(this).val().trim();
      $.get(routes.search.stop(keyword), function(results) {
        domBuilders.searchHowToGo('from', results)
      });  
      }
    );    
  };
  
  ajaxHandlers.searchToStop = function() {
    $('#toStopKeyword').keyup(function(event) {
      if (event.which == 13) {
        event.preventDefault();
      }
      var keyword = $(this).val().trim();
      $.get(routes.search.stop(keyword), function(results) {
        domBuilders.searchHowToGo('to', results)
      });  
      }
    );    
  };  
    
  domBuilders.searchHowToGo = function(type, results) {
    $('#howToGoDetail').fadeOut();
    if (results.length > 0) {
      $('#stopResults table tbody').empty();
      $('#noResultMessage').fadeOut();
      $('#stopResults').slideDown();
      $.each(results, function(index, val) {
        $('#stopResults table tbody').append(partialViews.searchStopResult(val));
      });
      $('#stopResults table tbody tr').click(function () {
        $('#' + type + 'StopKeyword').data('stopId', $(this).data('stopId'))
        $('#' + type + 'StopKeyword').val($(this).text());
        $('#' + type + 'StopKeyword').css({'backgroundColor': '#DDD'})
        $('#stopResults').slideUp();
        ajaxHandlers.howToGo();
      });
    } else {
      $('#noResultMessage').fadeIn();      
    }
  };

  ajaxHandlers.howToGo = function() {
    var fromStop = $('#fromStopKeyword').data('stopId');
    var toStop = $('#toStopKeyword').data('stopId');
    if (fromStop && toStop) {
      $.get(routes.solutions.howtogo(fromStop, toStop), domBuilders.detailHowToGo);
    }
  };

  domBuilders.displaySolutions = function(suggestions) {
    $.each(suggestions, function(s, suggestion) {
      $('#howToGoSolutions').append(partialViews.detailTransportTable(s));
      $.each(suggestion.routes, function(r, route) {
          $('#solution-' + s).append(partialViews.detailTransportRow(route));
      });
    });
  };
  
  domBuilders.detailHowToGo = function(results) {
    $('#howToGoDetail').fadeIn();

    combinedRoutes = results.perfectRoutes.concat(results.suggestions);

    $('#howToGoInfo span').text(combinedRoutes.length);
    $('#howToGoSolutions').empty();

    domBuilders.displaySolutions(combinedRoutes);
  };
  
  partialViews.detailTransportTable = function(index) {
    return '<table id="solution-' + index + '" class="twelve"><thead><tr><th class="three">Biniş durağı</th><th class="three">İniş durağı</th><th class="one">Hat No</th><th class="five">Hat</th></tr></thead><tbody></tbody></table>';
  };
  
  partialViews.detailTransportRow = function(route) {
    return '<tr><td>' + route.from.name + '</td><td>' + route.to.name + '</td><td>' + route.bus.id + '</td><td>' + route.bus.name + '</td></tr>';
  };

  ajaxHandlers.searchBus = function() {
    $('#busKeyword').keyup(function(event) {
      if (event.which == 13) {
        event.preventDefault();
      }
      var keyword = $(this).val().trim();
      $.get(routes.search.bus(keyword), domBuilders.searchBus);  
      }
    );
  };

  domBuilders.searchBus = function(results) {
    if (results.length > 0) {
      $('#busResults table tbody').empty();
      $('#noResultMessage').fadeOut();
      $('#busResults').slideDown();
      $('#busDetail').fadeOut();
      $.each(results, function(index, val) {
        $('#busResults table tbody').append(partialViews.stopDetails(val));
      });
      $('#busResults table tbody tr').click(function () {
        ajaxHandlers.busDetails($(this).data('busId'));
      });
    } else {
      $('#noResultMessage').fadeIn();      
    }
  };
  
  ajaxHandlers.busDetails = function(id) {
    $.get(routes.bus.detail(id), domBuilders.busDetails);
  };
  
  domBuilders.busDetails = function(result) {
    $('#busResults').fadeOut();
    $('#noResultMessage').fadeOut();
    $('#busDetail').slideDown();
    $('#stops tbody').empty();
    $('#timetableWeekdays tbody').empty();
    $('#timetableSaturday tbody').empty();
    $('#timetableSunday tbody').empty();
    for (var i=0; i < helpers.max(result.stops.go.length, result.stops.turn.length); i++) {
      $('#stops tbody').append(
        partialViews.busStopTableRow(helpers.checkUndefinedBus(result.stops.go[i]), helpers.checkUndefinedBus(result.stops.turn[i]))
      )
    };
    for (var i=0; i < helpers.max(result.timesheet.weekdays.go.length, result.timesheet.weekdays.turn.length); i++) {
      $('#timetableWeekdays tbody').append(
        partialViews.busTimeTableRow(helpers.checkUndefined(result.timesheet.weekdays.go[i]), helpers.checkUndefined(result.timesheet.weekdays.turn[i]))
      );
    };
    for (var i=0; i < helpers.max(result.timesheet.saturday.go.length, result.timesheet.saturday.turn.length); i++) {
      $('#timetableSaturday tbody').append(
        partialViews.busTimeTableRow(helpers.checkUndefined(result.timesheet.saturday.go[i]), helpers.checkUndefined(result.timesheet.saturday.turn[i]))
      );
    };
    for (var i=0; i < helpers.max(result.timesheet.sunday.go.length, result.timesheet.sunday.turn.length); i++) {
      $('#timetableSunday tbody').append(
        partialViews.busTimeTableRow(helpers.checkUndefined(result.timesheet.sunday.go[i]), helpers.checkUndefined(result.timesheet.sunday.turn[i]))
      );
    };
  };
  
  partialViews.busStopTableRow = function(go, turn) {
    return '<tr><td>' + go.name + '<span class="district">' + go.district + '</span></td><td>' + turn.name + '<span class="district">' + turn.district + '</span></td></tr>';
  };

  partialViews.busTimeTableRow = function(go, turn) {
    return '<tr><td>' + go + '</td><td>' + turn + '</td></tr>';
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
      $('#stopResults table tbody').empty();
      $('#noResultMessage').fadeOut();
      $('#stopResults').slideDown();
      $('#stopDetail').fadeOut();
      $.each(results, function(index, val) {
        $('#stopResults table tbody').append(partialViews.searchStopResult(val));
      });
      $('#stopResults table tbody tr').click(function () {
        ajaxHandlers.stopDetails($(this).data('stopId'));
      });
    } else {
      $('#noResultMessage').fadeIn();      
    }
  };

  partialViews.searchStopResult = function(stop) {
    return '<tr data-stop-id=' + stop.id + '><td>' + stop.name + ' (' + stop.district + ')' + '</td></tr>';
  };

  ajaxHandlers.stopDetails = function(id) {
    $.get(routes.stop.detail(id), domBuilders.stopDetails);      
  };
  
  domBuilders.stopDetails = function(result) {
    map.setView(result.location, params.stopDetailZoom);
    L.Util.requestAnimFrame(map.invalidateSize, map, false, map._container);
    L.marker(result.location).addTo(map).bindPopup(result.name);
    $('#stopDetail table tbody').empty();    
    $('#stopInfo h3 span').text(result.name);
    if (result.bus.length > 0) {
      $('#stopResults').slideUp();
      $('#stopDetail').fadeIn();
      $.each(result.bus, function(index, val) {
        $('#stopDetail table tbody').append(partialViews.stopDetails(val));
      });    
    };
  };

  partialViews.stopDetails = function(bus) {
    return '<tr data-bus-id=' + bus.id + '><td>' + bus.id + '</td><td>' + bus.name + '</td></tr>';
  };
    
  ajaxHandlers.closestStop = function(latlng) {
    $.get(routes.stop.closest(latlng.lat, latlng.lng), function(json) {
      domBuilders.closestStop(json, latlng);
    });
  };
  
  domBuilders.closestStop = function(results, latlng) {
    if (results.length > 0) {
      $('#stopResults').slideDown();
      $.each(results, function(index, val) {
        $('#stopResults table tbody').append(partialViews.searchStopResult(val));
        L.marker(val.location).addTo(map).bindPopup(val.name + '</br>(Yaklaşık ' + helpers.calculateDistance(latlng.lat, latlng.lng, val.location[0], val.location[1]) + ' m)');
      }); 
      map.fitBounds(results.map(function(r){return r.location}));
      ajaxHandlers.closestStopRouting(latlng.lat + ',' + latlng.lng, results[0].location)
    } else {
      $('#noResultMessage').fadeIn();
    }
  };
  
  domBuilders.closestStopFound = function(latlng, accuracy) {
    $('#gettingLocationMessage').hide();
    $('#locationFoundMessage span').text(parseInt(accuracy));
    $('#locationFoundMessage').fadeIn();
    L.circle(latlng, accuracy / 2).addTo(map);
    L.popup().setLatLng(latlng).setContent(messages.youAreHere).openOn(map);
  };

  domBuilders.closestStopError = function(payload) {
    $('#gettingLocationMessage').hide();
    $('#locationErrorMessage').fadeIn();
    map.setView(params.istanbulLatLon, params.defaultZoom);
  };

  domBuilders.closestStopRouting = function(routing_payload) {
    L.polyline(routing_payload.route_geometry, {color: 'red'}).addTo(map);
  };

  ajaxHandlers.closestStopRouting = function(from, to) {
    $.getJSON(routes.misc.routing(from,to), domBuilders.closestStopRouting);
  };

  helpers.initializeMap = function() {
    map = L.map('map').setView(params.defaultLatLon, params.defaultZoom);
    L.tileLayer(params.tileLayerUrl, {
        maxZoom: params.MaxZoom,
        key: params.cloudMadeApiKey,
        styleId: params.styleId
    }).addTo(map);
  };
    
  helpers.locateUser = function() {
    $('#gettingLocationMessage').show();
    map.locate({setView:true, enableHighAccuracy:true, maxZoom: params.maxZoom});
    map.on('locationfound', helpers.onLocationFound);
    map.on('locationerror', helpers.onLocationError);
  };
  
  helpers.onLocationFound = function(payload) {
    domBuilders.closestStopFound(payload.latlng, payload.accuracy);
    ajaxHandlers.closestStop(payload.latlng);
  };
  
  helpers.onLocationError = function(payload) {
    domBuilders.closestStopError(payload);
  };

  helpers.max = function(num1, num2) {
    if (num1 > num2) {return num1};
    return num2;
  };
  
  helpers.checkUndefinedBus = function(variable) {
    if (typeof variable === 'undefined') {
      return {
        name: '',
        district: ''
      };
    };
    return variable;
  };

  helpers.checkUndefined = function(variable) {
    if (typeof variable === 'undefined') {
      return '';
    };
    return variable;
  };

  helpers.calculateDistance = function(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(0);
  };
  
  helpers.clearInputsWhenFocused = function() {
    $('input').focus(function() {
      $(this).val('');
      $(this).css({'backgroundColor': '#FFF'});
    });
  };
  
}

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

$.ajaxSetup({
  cache: false,
  dataType: 'json'
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-38712116-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var app = new App();
app.init();
