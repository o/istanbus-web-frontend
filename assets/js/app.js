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
	    $('#spinner').show();
		if (json.length > 0) {
          $('#search_results').empty();
          $('#bus_search').removeClass('error warning');
          $('#bus_search').addClass('success');
          $.each(json, function(index, val) {
            $('#search_results').append('<div class="row bus" rel="' + val._id + '"><div class="span2">' + val._id + '</div><div class="span10">' + val.name +'</div></div>');
          });
          $('#search_results .bus').click(function() {
            $.getJSON(api + '/bus/' + $(this).attr('rel'), function(json) {
                //
            })
            .complete(function() {
                //
            })
            .error(function() {
                //
            });
          });
      } else {
          $('#bus_search').removeClass('success error');
          $('#bus_search').addClass('warning');
      }
    })
    .complete(function() {
        //
		setTimeout("$('#spinner').hide()", 0);
    })
    .error(function() {
        $('#bus_search').removeClass('success warning');
        $('#bus_search').addClass('error');
		setTimeout("$('#spinner').hide()", 0);
    });
});
var opts = {
  lines: 13, // The number of lines to draw
  length: 7, // The length of each line
  width: 4, // The line thickness
  radius: 10, // The radius of the inner circle
  rotate: 0, // The rotation offset
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
$(document).ready(function() {
  	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
	$('#spinner').hide();
});