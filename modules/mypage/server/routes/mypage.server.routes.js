'use strict';

let mypageController = require('../controllers/mypage.server.controller');

module.exports = function (app) {
  // Routing logic
  // ...
  app.route('/api/mypage')
    .get(mypageController.getOrCreate);
};
