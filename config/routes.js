module.exports.routes = {
  '/': {
    view: 'pages/homepage'
  },
  //Tracking
  'GET /api/v1/tracking': 'TrackingController.getAllTracking',
  'POST /api/v1/tracking': 'TrackingController.postTracking',

  //Communication 
  'GET /api/v1/communication': 'CommunicationController.getAllCommunication',
  'POST /api/v1/communication': 'CommunicationController.postCommunication',
  'POST /api/v1/communication/update/:id': 'CommunicationController.putCommunication',
  'POST /api/v1/communication/update': 'CommunicationController.sortCommunication',
  'POST /api/v1/communication/delete/:id': 'CommunicationController.deleteCommunication',

  //Setting
  'GET /api/v1/setting': 'SettingController.getAllSetting',
  'POST /api/v1/setting': 'SettingController.postSetting',

  //Blog
  'GET /api/v1/blogs': 'BlogsController.getAllBlogs',

  //Restaurant
  'GET /api/v1/restaurant': 'RestaurantController.getAllOrRestaurant',
  'GET /api/v1/restaurant/dbsetting': 'RestaurantController.getOneRestaurantSetting',
  'POST /api/v1/restaurant': 'RestaurantController.postRestaurant',
  'POST /api/v1/restaurant/update/:id': 'RestaurantController.putRestaurant',
  'POST /api/v1/restaurant/update': 'RestaurantController.sortRestaurant',

  //AUTHENTICATION
  'POST /login': 'AuthController.login',
  'GET /api/v1/test': 'AuthController.test',
  'POST /test': 'AuthController.test',
 
};
