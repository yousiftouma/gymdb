(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MovieDetailsController', MovieDetailsController);

  MovieDetailsController.$inject = ['movieResolve', 'posterConfig'];

  function MovieDetailsController(movieResolve, posterConfig) {
    var vm = this;
    vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
    vm.movie = movieResolve.data;
    init();

    function init() {
    }
  }
}());
