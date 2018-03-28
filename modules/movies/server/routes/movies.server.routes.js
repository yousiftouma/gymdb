'use strict';

var moviesController = require('../controllers/movies.server.controller');

module.exports = function (app) {
  // Routing logic
  // ...
  app.route('/api/movies/search/:query')
    .get(moviesController.search);
};
