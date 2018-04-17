(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MovieDetailsController', MovieDetailsController);

  MovieDetailsController.$inject = ['moviesService', 'movieResolve', 'userMovieInfoResolve', 'posterConfig',
    'Authentication', '$anchorScroll', '$location'];

  function MovieDetailsController(moviesService, movieResolve, userMovieInfoResolve, posterConfig,
                                  authentication, $anchorScroll, $location) {
    let vm = this;
    vm.postComment = postComment;
    vm.updateWatchlist = updateWatchlist;
    vm.updateSeenList = updateSeenList;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.movie = movieResolve.data;
    vm.userMovieInfo = userMovieInfoResolve.data;
    vm.user = authentication.user;
    init();

    function init() {
      updateTooltips();
    }

    function updateTooltips() {
      if (!vm.user) {
        vm.seenTooltip = 'You must be logged in to do this';
        vm.watchTooltip = 'You must be logged in to do this';
      } else {
        vm.seenTooltip = vm.userMovieInfo.isOnSeenList ? 'Remove from seen movies' : 'Add to seen movies';
        vm.watchTooltip = vm.userMovieInfo.isOnWatchlist ? 'Remove from watchlist' : 'Add to watchlist';
      }
    }

    function handleError(response) {
      console.log('error');
      console.log(response);
    }

    function showComment(response) {
      console.log('success');
      vm.movie.comments = response.data.comments;
      vm.commentContent = '';

      $location.hash(`comment${vm.movie.comments.length}`);
      $anchorScroll();
    }

    function postComment() {
      const data = { movie: vm.movie.id, content: vm.commentContent };
      moviesService.postComment(data).then(showComment, handleError);
    }

    function updateWatchlist() {
      if (!vm.user) {
        return;
      }
      const data = { tmdbId: vm.movie.id, delete: vm.userMovieInfo.isOnWatchlist };
      moviesService.updateWatchlist(data).then(() => {
        vm.userMovieInfo = { ...vm.userMovieInfo.isOnWatchlist = !vm.userMovieInfo.isOnWatchlist, ...vm.userMovieInfo };
        updateTooltips();
      }, handleError);
    }

    function updateSeenList() {
      if (!vm.user) {
        return;
      }
      const data = { tmdbId: vm.movie.id, delete: vm.userMovieInfo.isOnSeenList };
      moviesService.updateSeenList(data).then(() => {
        vm.userMovieInfo = { ...vm.userMovieInfo.isOnSeenList = !vm.userMovieInfo.isOnSeenList, ...vm.userMovieInfo };
        updateTooltips();
      }, handleError);
    }

  }
}());
