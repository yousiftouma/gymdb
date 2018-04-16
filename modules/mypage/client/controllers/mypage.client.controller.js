(function() {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageController', MypageController);

  MypageController.$inject = ['$scope'];

  function MypageController($scope) {
    var vm = this;

    // Mypage controller logic
    // ...

    init();

    function init() {
    }
  }
})();
