(function () {
  'use strict';

  angular
    .module('movies.services')
    .factory('moviesService', moviesService);

  moviesService.$inject = ['$http', 'Authentication'];

  function moviesService($http, authentication) {
    // Movies service logic
    // ...

    // Public API
    return {
      searchMovies: function (query, page) {
        return $http({
          method: 'GET',
          url: `/api/movies/search/${query}/${page}`
        });
      },
      getMovie: function (id) {
        return $http({
          method: 'GET',
          url: `/api/movies/${id}`
        });
      },
      postComment: function (comment) {
        return $http({
          method: 'POST',
          url: '/api/comments',
          data: comment
        });
      },
      getMovies: function (movies) {
        if (movies.length === 0) {
          // If there are no movies we don't need to make a call to the server.
          return new Promise(function (resolve) {
            return resolve({ data: movies });
          });
        }
        return $http({
          method: 'GET',
          url: `/api/movies/list/${JSON.stringify(movies)}`
        });
      }
    };
  }
}());
