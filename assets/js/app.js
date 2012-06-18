var api = 'http://path/to/api/:port';
$("#bus_search_input").focus(function(event) {
    $('#bus_search').removeClass('success warning error');
});
$("#bus_search_input").keyup(function (event) {
    if (event.which == 13) {
        event.preventDefault();
    }
    var keyword = $(this).val().trim().toUpperCase();
    $.getJSON(api + '/bus/search/' + keyword, function(json, textStatus) {
      if (json.length > 0) {
          $('#search_results').empty();
          $('#bus_search').addClass('success');
          $.each(json, function(index, val) {
            $('#search_results').append('<div class="row bus" rel="' + val._id + '"><div class="span2">' + val._id + '</div><div class="span10">' + val.name +'</div></div>');
          });
          $('#search_results .bus').click(function() {
            $.getJSON(api + '/bus/' + $(this).attr('rel'), function(json) {
              console.log(json);
            });
          });
      } else {
          $('#bus_search').removeClass('success');
          $('#bus_search').addClass('warning');
      }
    });
});