(function () {
  'use strict';

  angular
    .module('mypage')
    .factory('mypageService', mypageService);

  mypageService.$inject = ['$http', 'Authentication'];

  function mypageService($http, authentication) {
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
})();
