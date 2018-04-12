'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Comment = mongoose.model('Comment'),
  _ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function (req, res) {
  let comment = new Comment(req.body);
  comment.user = req.user;
  comment.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
  console.log('logging req.user and comment');
  console.log(req.user);
  console.log(comment);
  console.log('finished logging req.user and comment');
};

/**
 * Show the current Comment
 */
exports.read = function (req, res) {

};

/**
 * Update a Comment
 */
exports.update = function (req, res) {

};

/**
 * Delete an Comment
 */
exports.delete = function (req, res) {

};

/**
 * List of Comments
 */
exports.list = function (req, res) {

};
