var sql = require("mssql");
var dbConfig = {
  user: "pgnotify",
  password: "pgnotify@123",
  server: "210.211.124.16",
  database: "PasGo-Notify-Setting",
  options: {
    encrypt: false
  }
};

module.exports = {

  getAllCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    let executeQuery = function (res, query) {
      sql.connect(dbConfig, function (err) {
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
              let reult = {
                communications: data.recordsets[0]
              }
              sql.close();
              return res.json(reult);
            }
          });
        }
      });
    }
    let query = "SELECT * FROM communication";
    executeQuery(res, query);
  },

  postCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    let newCommunication = req.body;
    let executeQuery = function (res, query) {
      sql.connect(dbConfig, function (err) {
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
              let result = {
                record: data.recordsets[0][0]
              }
              sql.close();
              return res.json(result);
            }
          });
        }
      });
    }
    let query = `insert into communication (image, title, content, action_discount, link_communication, category, is_active, locations, sortId)
        values('${newCommunication.image}', '${newCommunication.title}', '${newCommunication.content}', '${newCommunication.action_discount}', '${newCommunication.link_communication}', '${newCommunication.category}', '${newCommunication.is_active}', '${newCommunication.locations}', '${newCommunication.sortId}')
        SELECT * FROM communication WHERE id = SCOPE_IDENTITY()`;
    executeQuery(res, query);

  },

  putCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    let id = req.param('id');
    let executeQuery = function (res, query) {
      sql.connect(dbConfig, function (err) {
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
    let query = `UPDATE communication SET is_active = is_active ^ 1 WHERE id = ${id}`;
    executeQuery(res, query);
  },

  sortCommunication: async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let objSortId = req.body;
    let arrSortId = objSortId.updateSordId;
    console.log("doi tuong sortId: ", objSortId);
    console.log(arrSortId);
    

    for (let i = 0; i < arrSortId.length; i++) {
      let element = arrSortId[i];
      let query = {
        id: element.id
      }
      await Communication.update(query)
        .set({
          sortId: element.sortId
        });
    }
    return res.json({
      update: 'ok'
    })
  },

  deleteCommunication: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    let id = req.param('id');
    let executeQuery = function (res, query) {
      sql.connect(dbConfig, function (err) {
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
                status: " Status 200 ok"
              });
            }
          });
        }
      });
    }
    let query = `DELETE FROM communication WHERE id= ${id}`;
    executeQuery(res, query);
  }
};
