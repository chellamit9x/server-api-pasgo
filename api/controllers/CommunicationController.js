/**
 * TrackingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');


    let communications = await Communication.find();
    return res.json({ communications: communications });

  },

  postCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let newCommunication = req.body;

    let arrmaxC = await Communication.find({
      where: {},
      limit: 1,
      sort: 'sortId DESC'
    });
    if (arrmaxC.length !== 0) {
      newCommunication.sortId = arrmaxC[0].sortId + 1;
    }
    let record = await Communication.create(newCommunication).fetch();

    return res.json({ record: record });
  },

  putCommunication: async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let id = req.param('id');
    let query = { id: id }
    let communication = await Communication.findOne(query);
    let is_active = communication.is_active;

    await Communication.update(query)
      .set({ is_active: !is_active });
    return res.json({ update: 'ok' })


  },

  sortCommunication: async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let objSortId = req.body;
    let arrSortId = objSortId.updateSordId;

    for (let i = 0; i < arrSortId.length; i++) {
      let element = arrSortId[i];
      let query = {id: element.id}
      await Communication.update(query)
      .set({ sortId: element.sortId });
    }

    return res.json({ update: 'ok' })


  },




  deleteCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    // let query = req.body;
    let id = req.param('id');

    // let query = {id: id}
    await Communication.destroy(id);
    return res.json({ status: " Status 200 ok" });
  }
};

