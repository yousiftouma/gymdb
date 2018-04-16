'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Mypage = mongoose.model('Mypage'),
  _ = require('lodash');

/**
 * Create a Mypage if one doesn't exist, else fetch it
 */
exports.getOrCreate = function (req, res) {
  let doc = null;
  Mypage.find({ user: req.user._id }, function (error, mypage) {
    if (mypage === undefined || mypage.length === 0) {
      // Create a new Mypage document and persist in storage
      doc = new Mypage({
        user: req.user._id,
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
    } else {
      // Mypage exists, get it
      doc = mypage[0];
    }
    // Return Mypage
    res.json(doc);
  });
};

/**
 * Update a Mypage
 */
exports.update = function (req, res) {

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
