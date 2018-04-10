(function () {
  'use strict';

  // Movies module config
  angular
    .module('movies')
    .run(menuConfig)
    .constant('posterConfig', {
      imageBaseUrl: 'https://image.tmdb.org/t/p/',
      posterSizes: {
        sm: 'w92',
        md: 'w185',
        lg: 'w500',
        xl: 'w780',
        og: 'original'
      }
    });

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Config logic
    menuService.addMenuItem('topbar', {
      title: 'Browse movies',
      state: 'movies.browse',
      roles: ['*']
    });
    // ...
  }
}());

