(function (app) {
  'use strict';

  app.registerModule('movies', ['core']);
  app.registerModule('movies.services');
  app.registerModule('movies.routes', ['ui.router', 'core.routes', 'movies.services']);
}(ApplicationConfiguration));
