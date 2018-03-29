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

      if(data !== null && data !== '') {
        movieService.searchMovies(data).then(populateMovies, handleError);
      }

    }

    function populateMovies(response) {
      vm.movieCount = response.data.total_results;
      vm.movies = response.data.results;
      vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
      vm.searchComplete = true;
    }
    function handleError(response) {
      console.log(response);
    }
  }
}());
