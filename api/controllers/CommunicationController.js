var sql = require("mssql");
const config = require('./../../config/env/dbconfig');
const jwt = require('jsonwebtoken');

module.exports = {

  getAllCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Expose-Headers', 'Authorization')

    var token = req.header('Authorization');




    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'supersecret', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      let executeQuery = function (res, query) {
        new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
          return pool.request().query(query);
        }).then((data) => {
          let reult = {
            communications: data.recordsets[0]
          }
          sql.close();
          return res.status(200).json(reult);
        }).catch((err) => {
          sql.close();
          return res.status(500).send({ message: `${err}` });
        });
      }
      let query = "SELECT * FROM communication";
      executeQuery(res, query);

    })


  },



  getNotifyAllCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Expose-Headers', 'Authorization')

    var token = req.header('Authorization');

      let executeQuery = function (res, query) {
        new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
          return pool.request().query(query);
        }).then((data) => {
          let reult = {
            communications: data.recordsets[0]
          }
          sql.close();
          return res.status(200).json(reult);
        }).catch((err) => {
          sql.close();
          return res.status(500).send({ message: `${err}` });
        });
      }
      let query = "SELECT * FROM communication";
      executeQuery(res, query);

  },



  postCommunication: async (req, res) => {

    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Content-Type, Authorization');
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Expose-Headers', 'Authorization')

    var token = req.header('Authorization');
    
    

    let newCommunication = req.body;



    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'supersecret', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });



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
              let reult = {
                record: data.recordsets[0][0]
              }
              sql.close();
              return res.json(reult);
            }
          });
        }
      });
    }
    let query = `insert into communication (image, title, content, action_discount, link_communication, category, is_active, locations, sortId)
        values('${newCommunication.image}',   N'${newCommunication.title}', N'${newCommunication.content}', N'${newCommunication.action_discount}', '${newCommunication.link_communication}', '${newCommunication.category}', '${newCommunication.is_active}', '${newCommunication.locations}', '${newCommunication.sortId}')
        SELECT * FROM communication WHERE id = SCOPE_IDENTITY()`;
    executeQuery(res, query);
  })

  },

  putCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    var token = req.header('Authorization');



    let id = req.param('id');


    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'supersecret', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });


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
              res.send(err);
            } else {
              sql.close();
              return res.json({
                update: 'ok'
              });
            }
          });
        }
      });
    }
    let query = `EXEC UpdateNotify ${id}`;
    executeQuery(res, query);
  })
  },

  sortCommunication: async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    var token = req.header('Authorization');



    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'supersecret', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });



    let executeQuery = function (res, query) {
      new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
        return pool.request().query(query);
      }).then((result) => {
        let rows = result.recordset;
        res.status(200).json(rows);
        sql.close();
      }).catch((err) => {
        res.status(500).send({ message: `${err}` });
        sql.close();
      });
    }

    let objSortId = req.body;
    let arrSortId = objSortId.updateSordId;

    if (arrSortId) {
      arrSortId.forEach(element => {
        let query = `EXEC SortNotify ${element.id}, ${element.sortId}`;
        executeQuery(res, query);
      });
      
    }
  })

  },

  deleteCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');


    var token = req.header('Authorization');




    let id = req.param('id');

    
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'supersecret', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
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
                res.send(err);
              } else {
                sql.close();
                return res.json({ status: " Status 200 ok" });
              }
            });
          }
        });
      }
      let query = `DELETE FROM communication WHERE id= ${id}`;
      executeQuery(res, query);
    })
    
  }
};
