(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MovieDetailsController', MovieDetailsController);

  MovieDetailsController.$inject = ['moviesService', 'movieResolve', 'posterConfig', 'Authentication'];

  function MovieDetailsController(moviesService, movieResolve, posterConfig, authentication) {
    var vm = this;
    vm.postComment = postComment;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.movie = movieResolve.data;
    vm.user = authentication.user;
    init();

    function init() {
    }

    function postComment() {
      const data = { movie: 1, content: 'this is my post', user: 2 };
      moviesService.postComment(data);
    }
  }
}());
