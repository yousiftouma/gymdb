(function () {
  'use strict';

  angular
    .module('movies')
    .directive('ngEnter', ngenter);

  ngenter.$inject = [/* Example: '$state', '$window' */];

  function ngenter(/* Example: $state, $window */) {
    return {
      link: function postLink(scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
          if (event.which === 13) {
            scope.$apply(function () {
              scope.$eval(attrs.ngEnter, { 'event': event });
            });

            event.preventDefault();
          }
        });
      }
    };
  }
}());
