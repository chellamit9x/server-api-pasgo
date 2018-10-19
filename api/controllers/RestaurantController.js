/**
 * RestaurantController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getAllOrRestaurant: async (req, res) => {
    let link_restaurant = req.param('link_restaurant');
    if (link_restaurant) {
      let query = { link_restaurant: link_restaurant }
      let restaurant = await Restaurant.findOne(query)
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

      return res.json(restaurant);
    } else {
      let restaurants = await RestaurantSetting.find();
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      return res.json({ restaurants: restaurants });
    }

  },

  getOneRestaurantSetting: async (req, res) => {
    let link_restaurant = req.param('link_restaurant');
    if (link_restaurant) {
      let query = { link_restaurant: link_restaurant }
      let restaurant = await RestaurantSetting.findOne(query)
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

      return res.json(restaurant);
    } else {
      let restaurants = await RestaurantSetting.find();
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      return res.json(restaurants);
    }

  },

  postRestaurant: async (req, res) => {
    let restaurantBody = req.body;

    if (req.body.is_active === 'true' || req.body.is_active === 'false') {

      let arrmaxR = await RestaurantSetting.find({
        where: {},
        limit: 1,
        sort: 'sortId DESC'
      });

      console.log(arrmaxR);

      let addBody = {
        link_restaurant: restaurantBody.link_restaurant,
        image: restaurantBody.image,
        title: restaurantBody.title,
        content: restaurantBody.content,
        action_discount: restaurantBody.action_discount,
        locations: restaurantBody.locations,
        is_active: req.body.is_active,
        sortId: req.body.sortId
      }

      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      let restaurantAdd = await RestaurantSetting.findOrCreate({ link_restaurant: addBody.link_restaurant }, addBody)

      await RestaurantSetting.update({ id: restaurantAdd.id })
        .set({
          link_restaurant: restaurantBody.link_restaurant,
          image: restaurantBody.image,
          title: restaurantBody.title,
          content: restaurantBody.content,
          action_discount: restaurantBody.action_discount,
          locations: restaurantBody.locations,
        })
      let restaurantFind = await RestaurantSetting.findOne({ id: restaurantAdd.id })

      return res.json(restaurantFind)

    }
    // let addBody = {
    //   link_restaurant: restaurantBody.link_restaurant,
    //   image: restaurantBody.image,
    //   title: restaurantBody.title,
    //   content: restaurantBody.content,
    //   action_discount: restaurantBody.action_discount,
    //   locations: restaurantBody.locations
    // }
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // await Restaurant.create(addBody)
    return res.json({ status: 'false' })
  },


  putRestaurant: async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let id = req.param('id');
    let query = { id: id }
    let restaurant = await RestaurantSetting.findOne(query);
    let is_active = restaurant.is_active;

    await RestaurantSetting.update(query)
      .set({ is_active: !is_active });
    return res.json({ update: 'ok' })

  },


  sortRestaurant: async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let objSortId = req.body;
    let arrSortId = objSortId.updateSordId;

    for (let i = 0; i < arrSortId.length; i++) {
      let element = arrSortId[i];
      let query = {id: element.id}
      await RestaurantSetting.update(query)
      .set({ sortId: element.sortId });
    }

    return res.json({ update: 'ok' })


  },



};

