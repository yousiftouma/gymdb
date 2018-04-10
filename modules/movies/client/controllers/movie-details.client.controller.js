(function() {
  'use strict';

  angular
    .module('movies')
    .controller('MovieDetailsController', MovieDetailsController);

  MovieDetailsController.$inject = ['$scope'];

  function MovieDetailsController($scope) {
    var vm = this;

    // Movie details controller logic
    // ...

    init();

    function init() {
    }
  }
})();
