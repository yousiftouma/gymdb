'use strict';

/**
 * Module dependencies.
 */
let should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Movie = mongoose.model('Movie');

/**
 * Globals
 */
let user,
  movie;

/**
 * Unit tests
 */
describe('Movie Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      movie = new Movie({
        // Add model fields
        // ...
        comments: [],
        tmdbId: 1
      });
      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      movie.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
    /* it('should fail', function (done) {
      movie.save(function (err) {
        done(new Error('fail on purpose'));
      });
    });*/
  });

  afterEach(function (done) {
    Movie.remove().exec();
    User.remove().exec();

    done();
  });
});
