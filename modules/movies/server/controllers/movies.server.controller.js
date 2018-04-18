'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Movie = mongoose.model('Movie'),
  _ = require('lodash');

let networkModule = require('../../../../config/lib/network');
let config = require(path.resolve('./config/config'));

/**
 * Create a Movie
 */
exports.createOrUpdate = function (req, res) {
  let doc = null;
  Movie.find({ tmdbId: req.body.movie }, function (error, movie) {
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
        res.json(doc);
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
    Movie.find({ tmdbId: req.params.id }, function (error, movie) {
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
 * Gets array of movie data based on an array of Tmdb ids
 */
exports.getByIds = function (req, res) {
  let parsedIds = JSON.parse(req.params.ids);
  let promises = [];
  // Start fetching from tmdb api async using promises
  parsedIds.forEach(function (movie) {
    promises.push(new Promise(function (resolve) {
      let options = {
        host: config.movieDbInfo.baseUrl,
        path: '/3/movie/' + 853479359 + '?api_key=' + config.movieDbInfo.apiKey,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      networkModule.getJson(options, function (statusCode, jsonObject) {
        if (statusCode !== 200) {
          // We don't want explicit reject, just return an empty object instead if failed
          resolve({});
        }
        resolve(jsonObject);
      });
    }));
  });
  // Return to response once all promises resolve
  Promise.all(promises).then(function (result) {
    res.json(result);
  });
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
