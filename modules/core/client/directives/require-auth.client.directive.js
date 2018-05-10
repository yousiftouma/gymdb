(function () {
  'use strict';

  angular
    .module('core')
    .directive('requireAuth', requireAuth);

  requireAuth.$inject = ['$state', 'Authentication'];

  /**
   * This attribute directive will check whether a user is authorized or not to perform the task that used this
   * directive. If not the state will be stored and the user will be directed to the sign in page. After a successful
   * sign in the user will be directed back to the previous state. This directive is a "click" event.
   */
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
