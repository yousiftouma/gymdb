(function () {
  'use strict';

  angular
    .module('core')
    .directive('requireAuth', requireAuth);

  requireAuth.$inject = ['$state', 'Authentication'];

  function requireAuth($state, auth) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.bind('click', function (event) {
          if (!auth.user) {
            const prev = {
              state: $state.current,
              params: $state.params,
              href: $state.href($state.current, $state.params)
            };
            let curr = $state.current;
            let params = $state.params;
            let href = $state.href(curr, params);
            $state.go('authentication.signin').then(function () {
              $state.previous = prev;
            });
          } else {
            // If auth check passes, apply function specified in directive
            scope.$apply(function () {
              scope.$eval(attrs.requireAuth, { 'event': event });
            });
          }
          event.preventDefault();
        });
      }
    };
  }
}());
