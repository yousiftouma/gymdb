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
      state: 'mypage',
      roles: ['user', 'admin'],
      type: 'dropdown',
      position: 1
    });

    menuService.addSubMenuItem('topbar', 'mypage', {
      title: 'Watchlist',
      state: 'mypage.watch'
    });

    menuService.addSubMenuItem('topbar', 'mypage', {
      title: 'Seen movies',
      state: 'mypage.seen'
    });
  }
})();
