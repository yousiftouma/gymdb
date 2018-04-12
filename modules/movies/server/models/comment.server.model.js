'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
  // Comment model fields
  // ...
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    default: '',
    trim: true,
    required: 'Comment can not be empty'
  },
  movie: {
    type: Number,
    required: 'Comment must belong to a movie'
  }

});

mongoose.model('Comment', CommentSchema);
