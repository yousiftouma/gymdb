(function () {
  'use strict';

  angular
    .module('movies')
    .factory('moviesService', moviesService);

  moviesService.$inject = [/* Example: '$state', '$window' */];

  function moviesService(/* Example: $state, $window */) {
    // Movies service logic
    // ...

    // Public API
    return {
      someMethod: function () {
        return true;
      }
    };
  }
}());
