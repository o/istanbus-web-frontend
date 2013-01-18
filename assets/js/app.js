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
    apiEndpoint: 'http://178.79.173.195:8000',
    defaultZoom: 8,
    stopDetailZoom: 15,
    closestStopsZoom: 14,
    maxZoom: 18,
    styleId: 998,
    tileLayerUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    cloudMadeApiKey: '5f9a0dab187a45cf8688a68cb55680a2',
    defaultLatLon: [0,0]
  };
  var map;
  var mapLayers = {
    ui: {
      marker: {
        default: {},
        closestStops: []
      },
      popup: {
        default: {}
      },
    },
    vector: {
      circle: {
        default: {}
      }
    }
  }
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
    helpers.initializeMap();
  };
  
  onLoadHandlers.closestStop = function() {
    helpers.initializeMap();
    helpers.locateUser();
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
    return '<tr data-stop-id=' + stop.id + '><td>' + stop.name + '</td></tr>';
  };

  ajaxHandlers.stopDetails = function(id) {
    $.get(routes.stop.detail(id), domBuilders.stopDetails);      
  };
  
  domBuilders.stopDetails = function(result) {
    map.setView(result.location, params.stopDetailZoom);
    L.Util.requestAnimFrame(map.invalidateSize, map, false, map._container);
    L.marker(result.location).addTo(map).bindPopup(result.name);
    $('#stopDetail table tbody').empty();    
    $('#stopInfo').html(partialViews.stopInfo(result));
    if (result.bus_list.length > 0) {
      $('#stopResults').slideUp();
      $('#stopDetail').fadeIn();
      $.each(result.bus_list, function(index, val) {
        $('#stopDetail table tbody').append(partialViews.stopDetails(val));
      });    
    };
    
  };

  partialViews.stopDetails = function(bus) {
    return '<tr data-bus-id=' + bus.id + '><td>' + bus.id + '</td><td>' + bus.name + '</td></tr>';
  };
  
  partialViews.stopInfo = function(stop) {
    return '<h3 class="subheader">' + stop.name  + ' durağından geçen otobüsler</h3>'
  };
  
  ajaxHandlers.closestStop = function(latlng) {
    $.get(routes.stop.closest(latlng.lat, latlng.lng), domBuilders.closestStop);
  };
  
  domBuilders.closestStop = function(results) {
    if (results.length > 0) {
      $('#stopResults').slideDown();
      $.each(results, function(index, val) {
        $('#stopResults table tbody').append(partialViews.searchStopResult(val));
        mapLayers.ui.marker.closestStops.push(L.marker(val.location).addTo(map).bindPopup(val.name));
      }); 
      map.setZoom(params.closestStopsZoom);
    } else {
      $('#noResultMessage').fadeIn();
    }
  };
  
  domBuilders.closestStopFound = function(latlng, accuracy) {
    $('#gettingLocationMessage').hide();
    $('#locationFoundMessage span').text(parseInt(accuracy));
    $('#locationFoundMessage').fadeIn();
    map.removeLayer(mapLayers.ui.marker.default);
    mapLayers.vector.circle.default.setLatLng(latlng).setRadius(accuracy / 2);
    mapLayers.ui.popup.default.setLatLng(latlng).setContent(messages.youAreHere);
  };

  domBuilders.closestStopError = function(payload) {
    $('#gettingLocationMessage').hide();
    $('#locationErrorMessage').fadeIn();
  };

  helpers.initializeMap = function() {
    map = L.map('map').setView(params.defaultLatLon, params.defaultZoom);
    L.tileLayer(params.tileLayerUrl, {
        maxZoom: params.MaxZoom,
        key: params.cloudMadeApiKey,
        styleId: params.styleId
    }).addTo(map);
    mapLayers.ui.marker.default = L.marker(params.defaultLatLon).addTo(map);
    mapLayers.vector.circle.default = L.circle(params.defaultLatLon, 0).addTo(map);
    mapLayers.ui.popup.default = L.popup().setLatLng(params.defaultLatLon).openOn(map);
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

}

$.ajaxSetup({
  cache: false,
  dataType: 'json'
});

var app = new App();
app.init();