'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Movie = mongoose.model('Movie'),
  _ = require('lodash');

var networkModule = require('../../../../config/lib/network');
var config = require(path.resolve('./config/config'));

/**
 * Create a Movie
 */
exports.createOrUpdate = function (req, res) {
  let doc = null;
  Movie.find({ tmdbId: req.body.movie }, function (error, movie) {
    if (movie === undefined || movie.length === 0) {
      // Create a new movie document and persist in storage
      doc = new Movie({
        tmdbId: req.body.movie,
        comments: [{
          user: req.user,
          content: req.body.content
        }]
      });
    } else {
      console.log('logging movie');
      console.log(movie);
      // Push new comment to array
      doc = movie[0];
      console.log('logging doc');
      console.log(doc);
      console.log('logging doc.comments');
      console.log(doc.comments);
      doc.comments.push({
        user: req.user._id,
        content: req.body.content
      });
      console.log('logging pushed');
      console.log(doc.comments);
    }
    doc.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(movie);
      }
    });
  });
};

/**
 * Show the current Movie
 */
exports.read = function (req, res) {
  let options = {
    host: config.movieDbInfo.baseUrl,
    path: '/3/movie/' + req.params.id + '?api_key=' + config.movieDbInfo.apiKey,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  networkModule.getJson(options, function (statusCode, jsonObject) {
    // TODO append comments before returning
    res.json(jsonObject);
  });
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
  let options = {
    host: config.movieDbInfo.baseUrl,
    path: '/3/search/movie?api_key=' + config.movieDbInfo.apiKey + '&query=' + encodeURI(req.params.query) +
    '&page=' + encodeURI(req.params.page),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  networkModule.getJson(options, function (statusCode, jsonObject) {
    res.json(jsonObject);
  });
};
