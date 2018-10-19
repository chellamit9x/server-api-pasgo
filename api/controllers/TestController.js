/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var bodyParser = require("body-parser");
var sql = require("mssql");

var dbConfig = {
    user:  "sa",
    password: "12345",
    server: "localhost",
    database: "pasgodemo",
    options:{
        encrypt: false
    }
};

var  executeQuery = function(res, query){	
    sql.connect(dbConfig, function (err) {
        if (err) {   
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, data) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    console.log(data);
                    
                    res.send(data);
                    sql.close()
                }
            });
        }
    });	
}

module.exports = {
    getTest: (req, res)=>{

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");


        //Function to connect to database and execute query

        var query = "select * from [test]";
        executeQuery (res, query);

    },
    postTest: (req, res)=>{
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
        console.log(res);
        
        var query = "INSERT INTO [test] (name) VALUES ('pasgopasgo')";
        executeQuery (res, query);
        var queryTk = "INSERT INTO [test] (name) VALUES ('pasgopasgo')";
	    executeQuery (res, query);
    }

};

