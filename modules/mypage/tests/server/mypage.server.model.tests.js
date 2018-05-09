'use strict';

/**
 * Module dependencies.
 */
let should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mypage = mongoose.model('Mypage');

/**
 * Globals
 */
let user,
  mypage;

/**
 * Unit tests
 */
describe('Mypage Model Unit Tests:', function () {
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
      mypage = new Mypage({
        // Add model fields
        // ...
        seenMovies: [],
        watchlist: [],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      mypage.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Mypage.remove().exec();
    User.remove().exec();

    done();
  });
});
