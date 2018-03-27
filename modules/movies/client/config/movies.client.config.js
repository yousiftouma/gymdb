(function () {
  'use strict';

  // Movies module config
  angular
    .module('movies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Config logic
    menuService.addMenuItem('topbar', {
      title: 'Browse movies',
      state:'movies',
      roles: ['*']
    });
    // ...
  }
}());
