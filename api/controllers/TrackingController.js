/**
 * TrackingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let sql = require("mssql");
const config = require('./../../config/env/dbconfig');


module.exports = {
  getAllTracking: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');



    let executeQuery = function (res, query) {
      new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
        return pool.request().query(query);
      }).then((data) => {
        let result = data.recordsets[0];
        res.status(200).json(result);
        sql.close();
      }).catch((err) => {
        res.status(500).send({ message: `${err}` });
        sql.close();
      });
    }
    let query = `SELECT 
                    tracking.action, 
                    tracking.link_notify, 
                    tracking.time_current, 
                    tracking.name_notify
                  FROM tracking`
    executeQuery(res, query);
  },



  postTracking: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let executeQuery = function (res, query) {
      new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
        return pool.request().query(query);
      }).then((data) => {
        res.status(200).json({ status: 'ok' });
        sql.close();
      }).catch((err) => {
        res.status(500).send({ message: `${err}` });
        sql.close();
      });
    }

    let tracking = req.body;
    let action = tracking.action;
    let link_notify = tracking.link_notify;
    let time_current = tracking.time_current;
    let name_notify = tracking.name_notify;

    let query = `INSERT INTO tracking (action, link_notify, time_current, name_notify)
                  values (N'${action}', N'${link_notify}', '${time_current}', N'${name_notify}')`

    executeQuery(res, query);
  },

};

