(function () {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageSeenController', MypageSeenController);

  MypageSeenController.$inject = ['$scope', 'myPageResolve', 'seenMoviesResolve', 'posterConfig', 'mypageService',
    'moviesService', '$anchorScroll', 'Authentication'];

  function MypageSeenController($scope, myPageResolve, seenMoviesResolve, posterConfig, mypageService, moviesService,
                                $anchorScroll, Authentication) {
    let vm = this;
    vm.currentPage = 1;
    vm.previousPage = previousPage;
    vm.nextPage = nextPage;
    vm.user = Authentication.user;
    vm.movies = seenMoviesResolve;
    vm.seenMoviesLength = myPageResolve.data.seenMovies.length;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.removeFromSeenMovies = removeFromSeenMovies;
    vm.updateWatchlist = updateWatchlist;
    vm.postTweet = postTweet;
    // Mypage controller logic
    // ...

    init();

    function init() {
      vm.finalPage = vm.seenMoviesLength <= 10;
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


    function previousPage() {
      vm.currentPage = vm.currentPage - 1;
      let endIndex = vm.currentPage * 10;
      let moviesToGet = myPageResolve.data.seenMovies.slice(endIndex - 10, endIndex);
      getSeenMovies(moviesToGet).then((result) => {
        vm.movies = result;
        vm.finalPage = false;
        $anchorScroll();
      });
    }

    function nextPage() {
      vm.currentPage = vm.currentPage + 1;
      let endIndex = vm.currentPage * 10;
      let moviesToGet = myPageResolve.data.seenMovies.slice(endIndex - 10, endIndex);
      getSeenMovies(moviesToGet).then((result) => {
        vm.movies = result;
        if (vm.movies.length < 10) {
          vm.finalPage = true;
        }
        $anchorScroll();
      });
    }

    function getSeenMovies(moviesToGet) {
      return moviesService.getMovies(moviesToGet).then((result) => {
        // Append information regarding whether the movie is on users watchlist
        if (!result.data) {
          return [];
        }
        return result.data.map((movie) => {
          movie.isOnWatchlist = myPageResolve.data.watchlist.filter((watchlistMovie) => {
            return movie.id === watchlistMovie.tmdbId;
          }).length > 0;
          return movie;
        });
      });
    }

    function postTweet() {
      let data = {};
      let listString = 'These are my seen movies from GYmdb:';
      for (let i = 0; i < vm.movies.length; i++) {
        let movie = vm.movies[i];
        if (listString.length + movie.title.length < 135) {
          listString = `${listString}\n${movie.title}`;
        } else {
          break;
        }
      }
      data.status = listString;
      mypageService.sendTweet(data).then((result) => {
        console.log(result);
      });
    }
  }
}());
