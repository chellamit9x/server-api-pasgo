/**
 * TrackingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllTracking: async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let trackings = await Tracking.find();
    return  res.json(trackings);

  },

  postTracking: async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let newTracking = req.body;
    let resulfTracking = await Tracking.create(newTracking).fetch();
    return  res.json(resulfTracking);
  },

};

