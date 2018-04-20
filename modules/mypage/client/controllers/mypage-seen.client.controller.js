(function () {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageSeenController', MypageSeenController);

  MypageSeenController.$inject = ['$scope', 'myPageResolve', 'seenMoviesResolve', 'posterConfig', 'mypageService'];

  function MypageSeenController($scope, myPageResolve, seenMoviesResolve, posterConfig, mypageService) {
    let vm = this;
    console.log('in seen');
    vm.movies = seenMoviesResolve;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.removeFromSeenMovies = removeFromSeenMovies;
    vm.updateWatchlist = updateWatchlist;
    // Mypage controller logic
    // ...

    init();

    function init() {
    }

    function removeFromSeenMovies(movieId) {
      const data = { tmdbId: movieId, delete: true };
      mypageService.updateSeenMovies(data).then(() => {
        vm.movies = vm.movies.filter((movie) => {
          return movie.id !== movieId;
        });
      }, handleError);
    }

    function updateWatchlist(movieId, isOnWatchlist) {
      const data = { tmdbId: movieId, delete: isOnWatchlist };
      mypageService.updateWatchlist(data).then(() => {
        vm.movies = vm.movies.map((movie) => {
          if (movie.id === movieId) {
            movie.isOnWatchlist = !isOnWatchlist;
          }
          return movie;
        });
      }, handleError);
    }

    function handleError(error) {
      console.log('Logging error');
      console.log(error);
    }
  }
})();
