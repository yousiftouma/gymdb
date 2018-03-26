(function () {
  'use strict';

  angular
    .module('movies')
    .controller('MoviesController', MoviesController);

  MoviesController.$inject = ['$scope'];

  function MoviesController($scope) {
    var vm = this;

    // Movies controller logic
    // ...

    init();

    function init() {
    }
  }
}());
