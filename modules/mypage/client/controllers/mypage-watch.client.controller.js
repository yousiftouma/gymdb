(function() {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageWatchController', MypageWatchController);

  MypageWatchController.$inject = ['$scope', 'myPageResolve', 'watchlistResolve'];

  function MypageWatchController($scope, myPageResolve, watchlistResolve) {
    let vm = this;
    console.log(watchlistResolve);
    console.log(myPageResolve);

    // Mypage controller logic
    // ...

    init();

    function init() {
    }
  }
})();
