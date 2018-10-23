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
      sql.connect(config.dbConfigSetting, function (err) {
        if (err) {
          console.log("Error while connecting database :- " + err);
          res.send(err);
        } else {
          var request = new sql.Request();
          request.query(query, function (err, data) {
            if (err) {
              console.log("Error while querying database :- " + err);
              sql.close();
              res.send(err);
            } else {
              let result = data.recordsets[0];
              sql.close();
              return res.status(200).json(result);;
            }
          });
        }
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
      sql.connect(config.dbConfigSetting, function (err) {
        if (err) {
          console.log("Error while connecting database :- " + err);
          res.send(err);
        } else {
          var request = new sql.Request();
          request.query(query, function (err, data) {
            if (err) {
              console.log("Error while querying database :- " + err);
              sql.close();
              res.send(err);
            } else {
              sql.close();
              return res.status(200).json({ status: 'ok' });;
            }
          });
        }
      });
    }

    let tracking = req.body;
    let action = tracking.action;
    let link_notify = tracking.link_notify;
    let time_current = tracking.time_current;
    let name_notify = tracking.name_notify;

    let query = `INSERT INTO tracking (action, link_notify, time_current, name_notify)
                  values ('${action}', '${link_notify}', '${time_current}', '${name_notify}')`

    executeQuery(res, query);
  },

};

