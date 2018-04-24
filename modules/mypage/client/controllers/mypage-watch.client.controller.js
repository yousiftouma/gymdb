(function () {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageWatchController', MypageWatchController);

  MypageWatchController.$inject = ['$scope', 'myPageResolve', 'watchlistResolve', 'posterConfig',
    'mypageService', 'moviesService', '$anchorScroll'];

  function MypageWatchController($scope, myPageResolve, watchlistResolve, posterConfig, mypageService, moviesService,
                                 $anchorScroll) {
    let vm = this;
    vm.currentPage = 1;
    vm.previousPage = previousPage;
    vm.finalPage = false;
    vm.nextPage = nextPage;
    vm.moviesOnWatchlist = myPageResolve.data.watchlist.length;
    vm.movies = watchlistResolve;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.removeFromWatchlist = removeFromWatchlist;
    vm.updateSeenMovies = updateSeenMovies;
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

    function updateSeenMovies(movieId, isSeen) {
      const data = { tmdbId: movieId, delete: isSeen };
      mypageService.updateSeenMovies(data).then(() => {
        vm.movies = vm.movies.map((movie) => {
          if (movie.id === movieId) {
            movie.isSeen = !isSeen;
          }
          return movie;
        });
      }, handleError);
    }

    function handleError(error) {
      console.log('Logging error');
      console.log(error);
    }

    function previousPage() {
      vm.currentPage = vm.currentPage - 1;
      let endIndex = vm.currentPage * 10;
      let moviesToGet = myPageResolve.data.watchlist.slice(endIndex - 10, endIndex);
      getWatchlistMovies(moviesToGet).then((result) => {
        vm.movies = result;
        vm.finalPage = false;
        $anchorScroll();
      });
    }

    function nextPage() {
      vm.currentPage = vm.currentPage + 1;
      let endIndex = vm.currentPage * 10;
      let moviesToGet = myPageResolve.data.watchlist.slice(endIndex - 10, endIndex);
      getWatchlistMovies(moviesToGet).then((result) => {
        vm.movies = result;
        if (vm.movies.length < 10) {
          vm.finalPage = true;
        }
        $anchorScroll();
      });
    }

    function getWatchlistMovies(moviesToGet) {
      return moviesService.getMovies(moviesToGet).then((result) => {
        // Append information regarding whether the movie is seen by the user
        if (!result.data) {
          return [];
        }
        return result.data.map((movie) => {
          movie.isSeen = myPageResolve.data.seenMovies.filter((seenMovie) => {
            return movie.id === seenMovie.tmdbId;
          }).length > 0;
          return movie;
        });
      });
    }
  }
}());
