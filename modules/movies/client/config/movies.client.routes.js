(function () {
  'use strict';

  // Setting up route
  angular
    .module('movies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Movies state routing
    $stateProvider
      .state('movies', {
        abstract: true,
        url: '/movies',
        template: '<ui-view/>'
      })
      .state('movies.browse', {
        url: '',
        templateUrl: '/modules/movies/client/views/browse-movies.client.view.html',
        controller: 'MoviesController',
        controllerAs: 'vm'
      })
      .state('movies.details', {
        url: '/:id',
        templateUrl: '/modules/movies/client/views/movie-details.client.view.html',
        controller: 'MovieDetailsController',
        controllerAs: 'vm'
      });
  }
}());
