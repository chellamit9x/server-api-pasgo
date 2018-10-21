/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝


  //Tracking
  'GET /api/v1/tracking': 'TrackingController.getAllTracking',
  'POST /api/v1/tracking': 'TrackingController.postTracking',

  //Communication
  'GET /api/v1/communication': 'CommunicationController.getAllCommunication',
  'POST /api/v1/communication': 'CommunicationController.postCommunication',
  'POST /api/v1/communication/update/:id': 'CommunicationController.putCommunication',
  'POST /api/v1/communication/update': 'CommunicationController.sortCommunication',
  'POST /api/v1/communication/delete/:id': 'CommunicationController.deleteCommunication',

  //Article
  'GET /api/v1/articles': 'ArticlesController.getAllArticles',
  'POST /api/v1/articles': 'ArticlesController.postArticle',
  'POST /api/v1/articles/update/:id': 'ArticlesController.putArticle',

  //Setting
  'GET /api/v1/setting': 'SettingController.getAllSetting',
  'GET /api/v1/setting/:id': 'SettingController.getActiveSetting',
  'POST /api/v1/setting': 'SettingController.postSetting',
  'PUT /api/v1/setting': 'SettingController.putSetting',

  //Blog
  'GET /api/v1/blogs': 'BlogsController.getAllBlogs',
  'POST /api/v1/blogs': 'BlogsController.postBlog',

  //Restaurant
  'GET /api/v1/restaurant': 'RestaurantController.getAllOrRestaurant',
  'GET /api/v1/restaurant/dbsetting': 'RestaurantController.getOneRestaurantSetting',
  'POST /api/v1/restaurant': 'RestaurantController.postRestaurant',
  'POST /api/v1/restaurant/update/:id': 'RestaurantController.putRestaurant',
  'POST /api/v1/restaurant/update': 'RestaurantController.sortRestaurant',


    //New Restaurant
    // 'GET /api/v1/restaurant': 'NewRestaurantController.getAllOrRestaurant',
    // 'GET /api/v1/restaurant/dbsetting': 'RestaurantController.getOneRestaurantSetting',
    // 'POST /api/v1/restaurant': 'RestaurantController.postRestaurant',
    // 'POST /api/v1/restaurant/update/:id': 'RestaurantController.putRestaurant',
    // 'POST /api/v1/restaurant/update': 'RestaurantController.sortRestaurant',

    
  //Test
  'GET /api/v1/test': 'TestController.getTest',
  'POST /api/v1/test': 'TestController.postTest',

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
