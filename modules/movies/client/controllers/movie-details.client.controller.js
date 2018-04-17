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
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.movie = movieResolve.data;
    vm.userMovieInfo = userMovieInfoResolve.data;
    vm.user = authentication.user;
    init();

    function init() {
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

  }
}());
