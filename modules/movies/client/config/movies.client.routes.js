(function () {
  'use strict';

  // Setting up route
  angular
    .module('movies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Movies state routing
    $stateProvider
      .state('movies', {
        url: '/movies',
        templateUrl: 'modules/movies/client/views/movies.client.view.html',
        controller: 'MoviesController',
        controllerAs: 'vm'
      });
  }
}());
