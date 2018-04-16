(function () {
  'use strict';

  //Setting up route
  angular
    .module('mypage')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Mypage state routing
    $stateProvider
      .state('mypage', {
        url: '/mypage',
        templateUrl: 'modules/mypage/client/views/mypage.client.view.html',
        controller: 'MypageController',
        controllerAs: 'vm'
      });
  }
})();
