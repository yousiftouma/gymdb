(function () {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageWatchController', MypageWatchController);

  MypageWatchController.$inject = ['$scope', 'myPageResolve', 'watchlistResolve', 'posterConfig', 'mypageService'];

  function MypageWatchController($scope, myPageResolve, watchlistResolve, posterConfig, mypageService) {
    let vm = this;
    vm.movies = watchlistResolve;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.removeFromWatchlist = removeFromWatchlist;
    vm.updateSeenList = updateSeenList;
    // Mypage controller logic
    // ...

    init();

    function init() {
    }

    function removeFromWatchlist(movieId) {
      const data = { tmdbId: movieId, delete: true };
      mypageService.updateWatchlist(data).then(() => {
        vm.movies = vm.movies.filter((movie) => {
          return movie.id !== movieId;
        });
      }, handleError);
    }

    function updateSeenList(movieId, isSeen) {
      const data = { tmdbId: movieId, delete: isSeen };
      mypageService.updateSeenList(data).then(() => {
        vm.movies = vm.movies.map((movie) => {
          if (movie.id === movieId) {
            movie.isSeen = !isSeen;
          }
          return movie;
        });
      });
    }

    function handleError(error) {
      console.log('Logging error');
      console.log(error);
    }
  }
}());
