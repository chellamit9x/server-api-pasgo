const sql = require("mssql");
const config = require('./../../config/env/dbconfig');
const jwt = require('jsonwebtoken');

module.exports = {
  login: function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let user = {
      UserName: req.body.UserName,
      Password: req.body.Password
    }

    let executeQuery = function (res, query) {
      new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
        return pool.request().query(query);
      }).then((data) => {
        if (data.rowsAffected[0] === 1) {
          let user = data.recordset[0];
          jwt.sign({
            user
          }, 'baomat', (err, token) => {
            return res.status(200).json({
              token: token
            });
          });
          sql.close();
        } else {
          sql.close();
          return res.sendStatus(403);
        }
      }).catch((err) => {
        sql.close();
        return res.status(500).send({
          message: `${err}`
        });
      });
    }
    let query = `SELECT * FROM Account WHERE UserName = '${user.UserName}' AND Password = '${user.Password}'`;
    executeQuery(res, query);
  }
}