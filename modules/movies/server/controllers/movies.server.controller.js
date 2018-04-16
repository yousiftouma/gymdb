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
  Movie.find({tmdbId: req.body.movie}, function (error, movie) {
    if (movie === undefined || movie.length === 0) {
      // Create a new movie document and persist in storage
      console.log(req.user);
      doc = new Movie({
        tmdbId: req.body.movie,
        comments: [{
          user: {
            name: req.user.username,
            picturePath: req.user.profileImageURL
          },
          content: req.body.content
        }]
      });
    } else {
      // Push new comment to array
      doc = movie[0];
      doc.comments.push({
        user: {
          name: req.user.username,
          picturePath: req.user.profileImageURL
        },
        content: req.body.content
      });
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
    Movie.find({tmdbId: req.params.id}, function (error, movie) {
      let comments = null;
      if (movie === undefined || movie.length === 0) {
        comments = [];
      } else {
        comments = movie[0].comments;
      }
      jsonObject.comments = comments;
      res.json(jsonObject);
    });
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
