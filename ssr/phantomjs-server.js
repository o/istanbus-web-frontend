var webpage = require('webpage');
var server = require('webserver').create();

var URL_PREFIX = "http://istanbus.org/#!";

var not_found = function(request, response) {
  console.log(request.url + " not found");
  response.statusCode = 404;
  response.write('<html><body>Not Found!</body></html>');
  response.close();
}

var service = server.listen(7070, function(request, response) {
  var url = request.url;
  var parts = url.split('_escaped_fragment_=');
  if (parts.length > 1) {
    var dest = URL_PREFIX + parts[1];
    console.log("working for url: " + dest);

    var page = webpage.create();
    page.settings.userAgent = 'istanbusSSR';
    page.open(dest, function (status) {
      if (status == 'success') {
        var html = page.evaluate(function () {
          return document.getElementsByTagName('html')[0].outerHTML;
        });
        response.statusCode = 200;
        response.write(html);
        response.close();
      }
      else {
        not_found(request, response);
      }
      page.release();
    });
  }
  else {
    not_found(request, response);
  }
});
