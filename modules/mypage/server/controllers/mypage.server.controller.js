'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Mypage = mongoose.model('Mypage'),
  _ = require('lodash');

const createMyPage = function (userId, res) {
  // Create a new Mypage document and persist in storage
  let doc = new Mypage({
    user: userId,
    seenMovies: [],
    watchlist: []
  });
  doc.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
  return doc;
};


/**
 * Create a Mypage if one doesn't exist, else fetch it
 */
exports.getOrCreate = function (req, res) {
  let doc = null;
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (mypage === undefined || mypage.length === 0) {
      doc = createMyPage(req.user._id, res);
    } else {
      // Mypage exists, get it
      doc = mypage[0];
    }
    // Return Mypage
    res.json(doc);
  });
};

/**
 * Get info from the logged in users MyPage for a particular movie
 * Returns an object with two bool properties for the given movie stating whether they are on the users
 * different lists
 */
exports.getByTmdbId = function (req, res) {
  let result = {};
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (mypage === undefined || mypage.length === 0) {
      // doesnt exist
      result.isOnSeenMovies = false;
      result.isOnWatchlist = false;
    } else {
      // Mypage exists, get it
      let doc = mypage[0];
      let id = parseInt(req.params.id, 10);
      result.isOnSeenMovies = doc.seenMovies.filter(elem => elem.tmdbId === id).length > 0;
      result.isOnWatchlist = doc.watchlist.filter(elem => elem.tmdbId === id).length > 0;
    }
    res.json(result);
  });
};

/**
 * Update list of seen movies
 */
exports.updateSeenMovies = function (req, res) {
  let doc = null;
  console.log(req);
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (mypage === undefined || mypage.length === 0) {
      doc = createMyPage(req.user._id, res);
    } else {
      // Mypage exists, get it
      doc = mypage[0];
    }
    if (req.body.delete) {
      // We want to delete the movie from the seen list
      doc.seenMovies = doc.seenMovies.filter(function (movie) {
        return movie.tmdbId !== req.body.tmdbId;
      });
    } else if (req.body.update) {
      // This could only be that the rating has changed
      doc.seenMovies.forEach(movie => {
        if (movie.tmdbId === req.body.tmdbId) {
          movie.rating = req.body.rating;
        }
      });
    } else {
      // Insert a new movie, default rating
      doc.seenMovies.push({
        tmdbId: req.body.tmdbId
      });
    }
    doc.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
    res.json(doc);
  });
};

/**
 * Update list of movies to watch
 */
exports.updateWatchlist = function (req, res) {
  let doc = null;
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (mypage === undefined || mypage.length === 0) {
      doc = createMyPage(req.user._id, res);
    } else {
      // Mypage exists, get it
      doc = mypage[0];
    }
    if (req.body.delete) {
      // We want to delete the movie from the watch list
      doc.watchlist = doc.watchlist.filter(function (movie) {
        return movie.tmdbId !== req.body.tmdbId;
      });
    } else {
      // Insert a new movie
      doc.watchlist.push({
        tmdbId: req.body.tmdbId
      });
    }
    doc.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
    res.json(doc);
  });
};

/**
 * Delete an Mypage
 */
exports.delete = function (req, res) {

};

/**
 * List of Mypages
 */
exports.list = function (req, res) {

};

