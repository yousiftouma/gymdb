(function () {
  'use strict';

  angular
    .module('mypage')
    .factory('mypageService', mypageService);

  mypageService.$inject = [/*Example: '$state', '$window' */];

  function mypageService(/*Example: $state, $window */) {
    // Mypage service logic
    // ...

    // Public API
    return {
      someMethod: function () {
        return true;
      }
    };
  }
})();
