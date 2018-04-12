(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MoviesController', MoviesController);

  MoviesController.$inject = ['moviesService', 'posterConfig', '$anchorScroll'];

  function MoviesController(moviesService, posterConfig, $anchorScroll) {
    var vm = this;
    vm.doSearch = doSearch;
    vm.previousPage = previousPage;
    vm.nextPage = nextPage;
    vm.currentPage = 1;
    // Movies controller logic
    // ...
    init();

    function init() {
    }

    function doSearch() {
      if (vm.searchField !== null && vm.searchField !== '' && vm.searchField !== undefined) {
        vm.query = vm.searchField;
        vm.currentPage = 1;
        fetchMovies();
      }
    }

    function populateMovies(response) {
      vm.data = response.data;
      vm.baseImagePath = posterConfig.imageBaseUrl + posterConfig.posterSizes.xl;
      vm.searchComplete = true;
    }

    function handleError(response) {
      console.log(response);
    }

    function nextPage() {
      if (vm.currentPage < vm.data.total_pages) {
        vm.currentPage = vm.currentPage + 1;
        fetchMovies();
        $anchorScroll();
      }
    }

    function previousPage() {
      if (vm.currentPage > 1) {
        vm.currentPage = vm.currentPage - 1;
        fetchMovies();
        $anchorScroll();
      }
    }

    function fetchMovies() {
      moviesService.searchMovies(vm.query, vm.currentPage).then(populateMovies, handleError);
    }

  }
}());
