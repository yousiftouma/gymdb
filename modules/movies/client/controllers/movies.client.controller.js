(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MoviesController', MoviesController);

  MoviesController.$inject = ['$scope'];

  function MoviesController($scope) {
    var vm = this;
    vm.doSearch = doSearch;

    // Movies controller logic
    // ...

    init();

    function init() {
    }

    function doSearch() {
      console.log('hej');
    }
  }
}());
