'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mypage Schema
 */
let MypageSchema = new Schema({
  // Mypage model fields
  // ...
  seenMovies: [{
    tmdbId: {
      type: Number,
      required: 'Movie must have a TMDB id'
    },
    rating: {
      type: Number,
      default: 0
    }
  }],
  watchlist: [{
    tmdbId: {
      type: Number,
      required: 'Movie must have a TMDB id'
    }
  }],
  user: {
    type: Schema.Types.ObjectId,
    required: 'Mypage must belong to a user'
  }
}, // fixes bug in mongoose
  { usePushEach: true });


mongoose.model('Mypage', MypageSchema);
