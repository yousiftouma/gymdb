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
        abstract: true,
        url: '/mypage',
        templateUrl: '/modules/mypage/client/views/mypage.client.view.html'
      })
      .state('mypage.watch', {
        url: '',
        templateUrl: '/modules/mypage/client/views/mypage-watch.client.view.html',
        controller: 'MypageWatchController',
        controllerAs: 'vm',
        data: {
          roles: ['users', 'admin']
        },
        resolve: {
          myPageResolve: getMyPage,
          watchlistResolve: getWatchlistMovies
        }
      })
      .state('mypage.seen', {
        url: '',
        templateUrl: '/modules/mypage/client/views/mypage-seen.client.view.html',
        controller: 'MypageSeenController',
        controllerAs: 'vm',
        data: {
          roles: ['users', 'admin']
        }
      });

    getMyPage.$inject = ['$stateParams', 'mypageService'];
    getWatchlistMovies.$inject = ['$stateParams', 'moviesService', 'myPageResolve'];

    function getMyPage($stateParams, mypageService) {
      return mypageService.getMyPage();
    }

    function getWatchlistMovies($stateParams, moviesService, myPageResolve) {
      let moviesToGet = myPageResolve.data.watchlist.slice(0, 10);
      return moviesService.getMovies(moviesToGet).then((result) => {
        console.log(result);
        // Append information regarding whether the movie is seen by the user
        let hej = result.data.map((movie) => {
          movie.isSeen = myPageResolve.data.seenMovies.filter((seenMovie) => {
            return movie.id === seenMovie.tmdbId;
          }).length > 0;
          return movie;
        });
        console.log(hej);
        return hej;
      });
    }
  }
}());
