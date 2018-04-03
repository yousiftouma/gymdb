'use strict';
var https = require('https');

module.exports.getJson = function (options, onResult) {
  var request = https.request(options, function (res) {
    var output = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', function () {
      var jsonObj = JSON.parse(output);
      onResult(res.statusCode, jsonObj);
    });
  });

  request.on('error', function (error) {
    console.log(error.message);
  });

  request.end();
};
