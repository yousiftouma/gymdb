(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MovieDetailsController', MovieDetailsController);

  MovieDetailsController.$inject = ['moviesService', 'movieResolve', 'posterConfig', 'Authentication'];

  function MovieDetailsController(moviesService, movieResolve, posterConfig, authentication) {
    let vm = this;
    vm.postComment = postComment;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.movie = movieResolve.data;
    vm.user = authentication.user;
    init();

    function init() {

    }

    function handleError(response) {
      console.log('error');
      console.log(response);
    }

    function showComment(response) {
      console.log(response);
      vm.commentContent = '';
    }

    function postComment() {
      const data = { movie: vm.movie.id, content: vm.commentContent, user: vm.user };
      moviesService.postComment(data).then(showComment, handleError);
    }

  }
}());
