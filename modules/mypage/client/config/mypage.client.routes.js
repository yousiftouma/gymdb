(function () {
  'use strict';

  // Setting up route
  angular
    .module('mypage')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Mypage state routing
    $stateProvider
      .state('mypage', {
        url: '/mypage',
        templateUrl: '/modules/mypage/client/views/mypage.client.view.html',
        controller: 'MypageController',
        controllerAs: 'vm',
        data: {
          roles: ['users', 'admin']
        },
        resolve: {
          myPageResolve: getMyPage
        }
      })
      .state('mypage.watch', {
        url: '/watch',
        templateUrl: '/modules/mypage/client/views/mypage-watch.client.view.html',
        controller: 'MypageWatchController',
        controllerAs: 'vm',
        data: {
          roles: ['users', 'admin']
        },
        resolve: {
          watchlistResolve: getWatchlistMovies
        }
      });

    getMyPage.$inject = ['$stateParams', 'mypageService'];
    getWatchlistMovies.$inject = ['$stateParams', 'mypageService', 'myPageResolve'];

    function getMyPage($stateParams, mypageService) {
      return mypageService.getMyPage();
    }

    function getWatchlistMovies($stateParams, mypageService, myPageResolve) {
      let moviesToGet = myPageResolve.data.watchlist.slice(0, 10);
      return mypageService.getMovies(moviesToGet);
    }
  }
}());
