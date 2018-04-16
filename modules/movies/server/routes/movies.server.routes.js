'use strict';

let moviesController = require('../controllers/movies.server.controller');

module.exports = function (app) {
  // Routing logic
  // ...
  app.route('/api/movies/search/:query/:page')
    .get(moviesController.search);
  app.route('/api/movies/:id')
    .get(moviesController.read);
  app.route('/api/comments')
    .post(moviesController.createOrUpdate);
};
