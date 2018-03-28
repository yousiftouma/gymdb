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
      vm.movie = response.data.results[0];
      vm.movie2 = response.data.results[1];

      vm.posterSrc = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl + vm.movie.poster_path;
      vm.posterSrc2 = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl + vm.movie2.poster_path;
    }
    function handleError(response) {
      console.log(response);
    }
  }
}());
