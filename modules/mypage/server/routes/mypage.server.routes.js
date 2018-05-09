'use strict';

let mypageController = require('../controllers/mypage.server.controller');

module.exports = function (app) {
  // Routing logic
  // ...
  app.route('/api/mypage')
    .get(mypageController.getOrCreate);
  app.route('/api/mypage/:id')
    .get(mypageController.getByTmdbId);
  app.route('/api/mypage/seen/update')
    .post(mypageController.updateSeenMovies);
  app.route('/api/mypage/watch/update')
    .post(mypageController.updateWatchlist);
  app.route('/api/mypage/tweet')
    .post(mypageController.tweet);
};
