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
 * This method expects a tmbdId for a movie, a comment made by a user and an authenticate user in the request.
 * Based on that tmdbId a movie will be fetched from the DB or created. The comment will be appended to the object and
 * saved into the DB. the method will store the document to the response object and be sent to the caller.
 * If something goes wrong during the process the response object will instead contain an error.
 */
exports.createOrUpdate = function (req, res) {
  let doc = null;
  Movie.find({ tmdbId: req.body.movie }, function (error, movie) {
    if (error) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
    }
    if (movie === undefined || movie.length === 0) {
      // Create a new movie document and persist in storage
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
 * This method expects a tmdbId for a movie in the request. This is used to make an http request to tmdb api to fetch
 * data for the specified movie. Comment data for the movie is fetched from the GYmdb database and appended to the
 * data received from tmdb. This is stored in the response object that is sent to the caller.
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
      if (error) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(error)
        });
      }
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
 * This method expects a list of objects that contains tmdbIds in the request object. The method fetches movie
 * data by making a request for each movie asynchronously. When all movies are fetched they are stored in the response
 * object that is sent to the caller.
 */
exports.getByIds = function (req, res) {
  let parsedIds = JSON.parse(req.params.ids);
  let promises = [];
  // Start fetching from tmdb api async using promises
  parsedIds.forEach(function (movie) {
    promises.push(new Promise(function (resolve) {
      let options = {
        host: config.movieDbInfo.baseUrl,
        path: '/3/movie/' + movie.tmdbId + '?api_key=' + config.movieDbInfo.apiKey,
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

/**
 * This method expects a search query for a movie and a page number in the request object. The query is a search string
 * used to fetch movies from tmdb. The page is used to specify which page to receive since tmbd api is using pages for
 * search results. The result is stored in the response object and sent to the caller.
 */
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
