'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var networkModule = require('../../../../config/lib/network');
var config = require(path.resolve('./config/config'));

/**
 * Create a Movie
 */
exports.create = function (req, res) {

};

/**
 * Show the current Movie
 */
exports.read = function (req, res) {

};

/**
 * Update a Movie
 */
exports.update = function (req, res) {

};

/**
 * Delete an Movie
 */
exports.delete = function (req, res) {

};

/**
 * List of Movies
 */
exports.list = function (req, res) {

};

exports.search = function (req, res) {
  var options = {
    host: config.movieDbInfo.baseUrl,
    path: '/3/search/movie?api_key=' + config.movieDbInfo.apiKey + '&query=' + encodeURI(req.params.query),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  console.log(options.host + options.path);
  networkModule.getJson(options, function (statusCode, jsonObject) {
    console.log('sending: ');
    console.log(jsonObject);
    res.json(jsonObject);
  });
};
