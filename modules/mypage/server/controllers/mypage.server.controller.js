'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Mypage = mongoose.model('Mypage'),
  _ = require('lodash'),
  CryptoJS = require("crypto-js"),
  moment = require('moment');

let networkModule = require('../../../../config/lib/network');
let utils = require('../../../../config/lib/utils');
let config = require(path.resolve('./config/config'));

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
 * Posts a tweet
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

  const oauthHeader = `OAuth oauth_consumer_key="${encodeURIComponent(consumerKey)}", oauth_nonce="${encodeURIComponent(nonce)}", oauth_signature="${encodeURIComponent(signature)}", oauth_signature_method="${encodeURIComponent(signMethod)}", oauth_timestamp="${encodeURIComponent(timestamp)}", oauth_token="${encodeURIComponent(token)}", oauth_version="${encodeURIComponent(version)}"`;

  let options = {
    host: config.twitter.baseUrl,
    path: `${tweetPath}?include_entities=${encodeURIComponent(includeEntities)}&status=${encodeURIComponent(status)}`,
    method: method,
    headers: {
      "Authorization": oauthHeader,
      "Content-Type": 'application/x-www-form-urlencoded'
    }
  };
  networkModule.getJson(options, function (statusCode, jsonObject) {
    console.log(jsonObject);
    res.json(jsonObject);
  });
};

function createOauthSignature(token, consumerKey, nonce, signMethod, timestamp, version, method, includeEntities,
                              status, tweetPath, baseUrl, consumerSecret, tokenSecret) {
  const parameters = `${encodeURIComponent('include_entities')}=${encodeURIComponent(includeEntities)}&${encodeURIComponent('oauth_consumer_key')}=${encodeURIComponent(consumerKey)}&${encodeURIComponent('oauth_nonce')}=${encodeURIComponent(nonce)}&${encodeURIComponent('oauth_signature_method')}=${encodeURIComponent(signMethod)}&${encodeURIComponent('oauth_timestamp')}=${encodeURIComponent(timestamp)}&${encodeURIComponent('oauth_token')}=${encodeURIComponent(token)}&${encodeURIComponent('oauth_version')}=${encodeURIComponent(version)}&${encodeURIComponent('status')}=${encodeURIComponent(status)}`;

  const message = `${method}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(parameters)}`;

  const key = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const hash = CryptoJS.HmacSHA1(message, key);
  return CryptoJS.enc.Base64.stringify(hash);
}

function getUserInfo(user) {
  if (user.provider === 'twitter') {
    // User is signed up with twitter
    return {
      token: user.providerData.token,
      tokenSecret: user.providerData.tokenSecret
    };
  }
  else if (user.additionalProvidersData.twitter) {
    // Twitter is linked to user account
    return {
      token: user.additionalProvidersData.twitter.token,
      tokenSecret: user.additionalProvidersData.twitter.tokenSecret
    };
  }
}
