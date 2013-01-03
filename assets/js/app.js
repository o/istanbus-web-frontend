var api = 'http://path/to/api/:port';
$("#bus_search_input").focus(function (event) {
    $('#bus_search').removeClass('success warning error');
});
$("#bus_search_input").keyup(function (event) {
    if (event.which == 13) {
        event.preventDefault();
    }
    var keyword = $(this).val().trim().toUpperCase();
    $.getJSON(api + '/search/bus/' + keyword, function (json, textStatus) {
        $('#spinner').show();
        if (json.length > 0) {
            $('#search_results').empty();
            $('#bus_search').removeClass('error warning');
            $('#bus_search').addClass('success');
            $.each(json, function (index, val) {
                $('#search_results').append('<div class="row bus" rel="' + val.id + '"><div class="span2">' + val.id + '</div><div class="span10">' + val.name + '</div></div>');
            });
            $('#search_results .bus').click(function () {
                $.getJSON(api + '/bus/' + $(this).attr('rel'), function (json) {
                    //
                }).complete(function () {
                    //
                }).error(function () {
                    //
                });
            });
        } else {
            $('#bus_search').removeClass('success error');
            $('#bus_search').addClass('warning');
        }
    }).complete(function () {
        $('#spinner').hide();
    }).error(function () {
        $('#bus_search').removeClass('success warning');
        $('#bus_search').addClass('error');
        $('#spinner').hide();
    });
});

var opts = {
    lines: 13,
    length: 7,
    width: 4,
    radius: 10,
    rotate: 0,
    color: '#000',
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    className: 'spinner',
    zIndex: 2e9,
    top: 'auto',
    left: 'auto'
};

$(document).ready(function () {
    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);
    $('#spinner').hide();
});