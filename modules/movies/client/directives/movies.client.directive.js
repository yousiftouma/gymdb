(function () {
  'use strict';

  angular
    .module('movies')
    .directive('movies', movies);

  movies.$inject = [/* Example: '$state', '$window' */];

  function movies(/* Example: $state, $window */) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // Movies directive logic
        // ...

        element.text('this is the movies directive');
      }
    };
  }
}());
