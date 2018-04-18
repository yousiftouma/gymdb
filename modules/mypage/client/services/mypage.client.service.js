(function () {
  'use strict';

  angular
    .module('mypage')
    .factory('mypageService', mypageService);

  mypageService.$inject = ['$http'];

  function mypageService($http) {
    // Mypage service logic
    // ...

    // Public API
    return {
      getMyPage: function () {
        return $http({
          method: 'GET',
          url: '/api/mypage'
        });
      },
      getMovies: function (movies) {
        if (movies.length === 0) {
          return movies;
        }
        return $http({
          method: 'GET',
          url: `/api/movies/list/${JSON.stringify(movies)}`
        });
      }
    };
  }
})();
