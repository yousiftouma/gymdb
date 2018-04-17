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
      getUserMovieInfo: function (id) {
        if (authentication.user) {
          return $http({
            method: 'GET',
            url: `/api/mypage/${id}`
          });
        } else {
          return new Promise(function (resolve) {
            return resolve({
              data: {
                error: true,
                msg: 'Not logged in'
              }
            });
          });
        }
      },
      updateSeenList: function (info) {
        return $http({
          method: 'POST',
          url: '/api/mypage/seen/update',
          data: info
        });
      },
      updateWatchlist: function (info) {
        return $http({
          method: 'POST',
          url: '/api/mypage/watch/update',
          data: info
        });
      }
    };
  }
}());
