(function () {
  'use strict';

  angular
    .module('mypage')
    .controller('MypageController', MypageController);

  MypageController.$inject = ['$scope'];

  function MypageController($scope) {
    let vm = this;

    // Mypage controller logic
    // ...
  }
}());
