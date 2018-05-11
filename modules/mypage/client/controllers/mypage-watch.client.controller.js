(function () {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageWatchController', MypageWatchController);

  MypageWatchController.$inject = ['$scope', 'myPageResolve', 'watchlistResolve', 'posterConfig',
    'mypageService', 'moviesService', '$anchorScroll', 'Authentication', 'Notification'];

  function MypageWatchController($scope, myPageResolve, watchlistResolve, posterConfig, mypageService, moviesService,
                                 $anchorScroll, Authentication, Notification) {
    let vm = this;
    vm.currentPage = 1;
    vm.previousPage = previousPage;
    vm.nextPage = nextPage;
    vm.user = Authentication.user;
    vm.watchlistLength = myPageResolve.data.watchlist.length;
    vm.movies = watchlistResolve;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.removeFromWatchlist = removeFromWatchlist;
    vm.updateSeenMovies = updateSeenMovies;
    vm.postTweet = postTweet;
    vm.finalPage = vm.watchlistLength <= 10;

    // Mypage watchlist controller logic
    // ...

    function removeFromWatchlist(movieId) {
      const data = { tmdbId: movieId, delete: true };
      mypageService.updateWatchlist(data).then((result) => {
        vm.watchlistLength = result.data.watchlist.length;
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
      Notification.error({
        title: 'Something went wrong!',
        message: error,
        delay: 5000
      });
    }

    function previousPage() {
      vm.currentPage = vm.currentPage - 1;
      let endIndex = vm.currentPage * 10;
      let moviesToGet = myPageResolve.data.watchlist.slice(endIndex - 10, endIndex);
      getWatchlistMovies(moviesToGet).then((result) => {
        vm.movies = result;
        vm.finalPage = false;
        $anchorScroll();
      }, handleError);
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
      }, handleError);
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
      }, handleError);
    }

    function postTweet() {
      if (!(vm.user.provider === 'twitter' ||
        vm.user.additionalProvidersData && vm.user.additionalProvidersData.twitter)) {
        return;
      }
      let data = {};
      let listString = 'This is my watchlist from GYmdb:';
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
        if (result.data.errors) {
          let error = result.data.errors[0];
          Notification.error({
            title: 'Failed tweeting your list!',
            message: `Error Code: ${error.code}, Message: ${error.message}`,
            delay: 5000
          });
        } else {
          Notification.success({
            title: 'Tweet posted successfully!',
            delay: 5000
          });
        }
      }, handleError);
    }
  }
}());
