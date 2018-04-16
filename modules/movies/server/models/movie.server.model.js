'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Movie Schema
 */
let MovieSchema = new Schema({
    // Movie model fields
    // ...
  comments: [{
    user: {
      name: {
        type: String
      },
      picturePath: {
        type: String
      }
    },
    content: {
      type: String,
      default: '',
      trim: true,
      required: 'Comment can not be empty'
    }
  }],
  tmdbId: {
    type: Number,
    required: 'Movie must have a TMDB id'
  }
}, // fixes bug in mongoose
  { usePushEach: true });

mongoose.model('Movie', MovieSchema);
