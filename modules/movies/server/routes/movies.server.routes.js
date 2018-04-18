'use strict';

let moviesController = require('../controllers/movies.server.controller');

module.exports = function (app) {
  // Routing logic
  // ...
  app.route('/api/movies/search/:query/:page')
    .get(moviesController.search);
  app.route('/api/movies/:id')
    .get(moviesController.read);
  app.route('/api/movies/list/:ids')
    .get(moviesController.getByIds);
  app.route('/api/comments')
    .post(moviesController.createOrUpdate);
};
