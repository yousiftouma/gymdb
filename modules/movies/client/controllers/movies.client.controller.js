(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MoviesController', MoviesController);

  MoviesController.$inject = ['$http', 'moviesService', 'posterConfig'];

  function MoviesController($http, movieService, posterConfig) {
    var vm = this;
    vm.doSearch = doSearch;
    // Movies controller logic
    // ...
    init();

    function init() {
    }

    function doSearch() {
      var data = vm.searchField;
      movieService.searchMovies(data).then(populateMovies, handleError);

    }

    function populateMovies(response) {
      vm.movies = response.data.results;
      vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;

    }
    function handleError(response) {
      console.log(response);
    }
  }
}());
