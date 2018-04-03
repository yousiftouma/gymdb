(function () {
  'use strict';

  angular
    .module('movies')
    .factory('moviesService', moviesService);

  moviesService.$inject = ['$http'];

  function moviesService($http) {
    // Movies service logic
    // ...

    // Public API
    return {
      searchMovies: function (query, page) {
        return $http({
          method: 'GET',
          url: `/api/movies/search/${query}/${page}`
        });
      }
    };
  }
}());
