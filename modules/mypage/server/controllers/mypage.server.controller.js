'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Mypage = mongoose.model('Mypage'),
  _ = require('lodash'),
  CryptoJS = require('crypto-js'),
  moment = require('moment');

let networkModule = require('../../../../config/lib/network');
let utils = require('../../../../config/lib/utils');
let config = require(path.resolve('./config/config'));

/**
 * Persists a new Mypage document in the database
 * If error is produced, this is returned in the response directly using the res parameter
 */
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
 * Expects an authenticated user in the request
 * Returns the Mypage in the response body or an error if something went wrong
 */
exports.getOrCreate = function (req, res) {
  let doc = null;
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (error) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
    }
    if (mypage === undefined || mypage.length === 0) {
      doc = createMyPage(req.user._id, res);
    } else {
      doc = mypage[0];
    }
    res.json(doc);
  });
};

/**
 * Get info from the logged in users MyPage for a particular movie
 * Expects an authenticated user in the request and a movie id in the request params.
 * Returns an object with two bool properties for the given movie stating whether they are on the users
 * different lists (watchlist and seen movies) or an error if something went wrong
 */
exports.getByTmdbId = function (req, res) {
  let result = {};
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (error) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
    }
    if (mypage === undefined || mypage.length === 0) {
      // Mypage doesn't even exist, so definitely false
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
 * Update list of seen movies for the logged in user making the request
 * Expects the body to contain a tmdbID and then some optional values
 * If the body contains delete = true, the movie will be deleted from Seen Movies
 * If the body contains update = true, we also expect a rating number value in the body
 * Returns the updated Mypage in the response body when done, or an error if something went wrong
 */
exports.updateSeenMovies = function (req, res) {
  let doc = null;
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (error) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
    }
    if (mypage === undefined || mypage.length === 0) {
      // Mypage doesn't exist yet, so create a new one first
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
 * Update watchlist for the logged in user making the request
 * Expects the body to contain a tmdbID and then optionally a bool value called delete
 * If the body contains delete = true, the movie will be deleted from the Watchlist
 * Returns the updated Mypage in the response body when done, or an error if something went wrong
 */
exports.updateWatchlist = function (req, res) {
  let doc = null;
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (error) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
    }
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
 * Posts a tweet for the authenticated user
 * Expects the body to contain a status with the information to tweet.
 */
exports.tweet = function (req, res) {
  let userInfo = getUserInfo(req.user);
  let token = userInfo.token;
  let consumerKey = config.twitter.clientID;
  let consumerSecret = config.twitter.clientSecret;
  let tokenSecret = userInfo.tokenSecret;
  let nonce = utils.generateNonce();
  let signMethod = 'HMAC-SHA1';
  let timestamp = moment().unix();
  let version = '1.0';
  let method = 'POST';
  let includeEntities = 'true';
  let status = req.body.status;
  let tweetPath = '/1.1/statuses/update.json';
  let baseUrl = 'https://' + config.twitter.baseUrl + tweetPath;

  let signature = createOauthSignature(token, consumerKey, nonce, signMethod, timestamp, version, method,
    includeEntities, status, tweetPath, baseUrl, consumerSecret, tokenSecret);

  // Build the Authorization header according to OAuth standards, following twitter instructions
  const oauthHeader = `OAuth oauth_consumer_key="${encodeURIComponent(consumerKey)}", oauth_nonce="${encodeURIComponent(nonce)}", oauth_signature="${encodeURIComponent(signature)}", oauth_signature_method="${encodeURIComponent(signMethod)}", oauth_timestamp="${encodeURIComponent(timestamp)}", oauth_token="${encodeURIComponent(token)}", oauth_version="${encodeURIComponent(version)}"`;

  let options = {
    host: config.twitter.baseUrl,
    path: `${tweetPath}?include_entities=${encodeURIComponent(includeEntities)}&status=${encodeURIComponent(status)}`,
    method: method,
    headers: {
      'Authorization': oauthHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  networkModule.getJson(options, function (statusCode, jsonObject) {
    res.json(jsonObject);
  });
};

/**
 * Builds an OAuth signature according to specification
 */
function createOauthSignature(token, consumerKey, nonce, signMethod, timestamp, version, method, includeEntities,
                              status, tweetPath, baseUrl, consumerSecret, tokenSecret) {
  // Concatenate parameters according to specification
  const parameters = `${encodeURIComponent('include_entities')}=${encodeURIComponent(includeEntities)}&${encodeURIComponent('oauth_consumer_key')}=${encodeURIComponent(consumerKey)}&${encodeURIComponent('oauth_nonce')}=${encodeURIComponent(nonce)}&${encodeURIComponent('oauth_signature_method')}=${encodeURIComponent(signMethod)}&${encodeURIComponent('oauth_timestamp')}=${encodeURIComponent(timestamp)}&${encodeURIComponent('oauth_token')}=${encodeURIComponent(token)}&${encodeURIComponent('oauth_version')}=${encodeURIComponent(version)}&${encodeURIComponent('status')}=${encodeURIComponent(status)}`;

  // Concatenate url with parameters according to spec
  const message = `${method}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(parameters)}`;

  const key = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const hash = new CryptoJS.HmacSHA1(message, key);
  // Return the hash of everything in Base64
  return CryptoJS.enc.Base64.stringify(hash);
}

function getUserInfo(user) {
  if (user.provider === 'twitter') {
    // User is signed up with twitter
    return {
      token: user.providerData.token,
      tokenSecret: user.providerData.tokenSecret
    };
  } else if (user.additionalProvidersData && user.additionalProvidersData.twitter) {
    // Twitter is linked to user account
    return {
      token: user.additionalProvidersData.twitter.token,
      tokenSecret: user.additionalProvidersData.twitter.tokenSecret
    };
  }
}
