/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


const config = require('./../../config/env/dbconfig');
const sql = require('mssql');
const jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

        let UserName = req.body.UserName;
        let Password = req.body.Password;


        let executeQuery = function (res, query) {
            new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
                return pool.request().query(query);
            }).then((data) => {
                if (data.rowsAffected[0] === 1) {
                    let user = data.recordset[0];
                    let token = jwt.sign({ id: user.id }, 'supersecret', {
                        expiresIn: 20
                    });
                    res.status(200).send({ auth: true, token: token });
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
        let query = `SELECT * FROM Account WHERE UserName = '${UserName}' AND Password = '${Password}'`;
        executeQuery(res, query);
    },

    test: (req, res) => {
        var token = req.header('Authorization');
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, 'supersecret', function (err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

            let executeQuery = function (res, query) {
                new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
                    return pool.request().query(query);
                }).then((data) => {
                    let user = data.recordset;
                    res.status(200).send(user);
                    sql.close();

                }).catch((err) => {
                    sql.close();
                    return res.status(500).send({
                        message: `${err}`
                    });
                });
            }
            let query = `SELECT * FROM test`;
            executeQuery(res, query);
        })

    },

};

