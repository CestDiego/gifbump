var http = require('http');

http.createServer(onRequest).listen(process.env.OPENSHIFT_NODEJS_PORT || 3000);

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  var options = {
    hostname: 'i.imgur.com',
    port: 80,
    path: client_req.url.indexOf('.gif') > 0 ? client_req.url : client_req.url + '.gif',
    method: 'GET'
  };

  var proxy = http.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}