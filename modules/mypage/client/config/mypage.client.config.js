(function() {
  'use strict';

  // Mypage module config
  angular
    .module('mypage')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Config logic
    // ...
    menuService.addMenuItem('topbar', {
      title: 'MY PAGE',
      state: 'mypage.watch',
      roles: ['user', 'admin'],
      position: 1
    });
  }
})();
