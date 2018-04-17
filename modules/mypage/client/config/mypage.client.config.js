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
      title: 'My page',
      state: 'mypage',
      roles: ['user', 'admin']
    });
  }
})();
