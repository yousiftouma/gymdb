(function () {
  'use strict';

  angular
    .module('movies')
    .filter('movies', movies);

  movies.$inject = [/* Example: '$state', '$window' */];

  function movies(/* Example: $state, $window */) {
    return function (input) {
      // Movies directive logic
      // ...

      return 'movies filter: ' + input;
    };
  }
}());
