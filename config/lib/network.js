'use strict';
const https = require('https');

/**
 * This method expects a option parameter used to specifiy the https request and a callback onResult to be used when
 * the request is done.
 */
module.exports.getJson = function (options, onResult) {
  let request = https.request(options, function (res) {
    let output = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', function () {
      let jsonObj = JSON.parse(output);
      onResult(res.statusCode, jsonObj);
    });
  });

  request.on('error', function (error) {
    console.log(error.message);
    onResult(error.statusCode, error.message);
  });
  request.end();
};
