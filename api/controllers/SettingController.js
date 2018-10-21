/**
 * SettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


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




  getAllSetting: async (req, res) => {

    if (req.param('is_active') === 'true') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

      let executeQuery = function (res, query) {
        sql.connect(dbConfig, function (err) {
          if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
          }
          else {
            // create Request object
            let request = new sql.Request();
            // query to the database
            request.query(query, function (err, data) {
              if (err) {
                console.log("Error while querying database :- " + err);
                sql.close()
                res.send(err);
              }
              else {
                // let result = data.recordsets[0];      
                let settingIsActive = data.recordsets[0][0];
                let resultIsActive = {
                  "id": settingIsActive.id,
                  "theme_options": {
                    "title_color": settingIsActive.title_color,
                    "background_color": settingIsActive.background_color,
                    "action_color": settingIsActive.action_color,
                    "content_color": settingIsActive.content_color
                  },
                  "display_option": {
                    "display_time": settingIsActive.display_option,
                    "delay_time": settingIsActive.delay_time,
                    "is_show_mobile": settingIsActive.is_show_mobile,
                    "mobile_position": settingIsActive.mobile_position,
                    "desktop_position": settingIsActive.desktop_position
                  },
                  "type": settingIsActive.type,
                  "is_active": settingIsActive.is_active
                }
                sql.close()
                return res.json(resultIsActive);
              }
            });
          }
        });
      }
      var query = "select * from [setting] where is_active = 1";
      executeQuery(res, query)
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

      let executeQuery = function (res, query) {
        new sql.ConnectionPool(dbConfig).connect().then((pool) => {
          return pool.request().query(query);
        }).then((data) => {
          let settingBasic = data.recordsets[0][0];
          let settingCustom = data.recordsets[0][1];
          let resultBasic = {
            "id": settingBasic.id,
            "theme_options": {
              "title_color": settingBasic.title_color,
              "background_color": settingBasic.background_color,
              "action_color": settingBasic.action_color,
              "content_color": settingBasic.content_color
            },
            "display_option": {
              "display_time": settingBasic.display_time,
              "delay_time": settingBasic.delay_time,
              "is_show_mobile": settingBasic.is_show_mobile,
              "mobile_position": settingBasic.mobile_position,
              "desktop_position": settingBasic.desktop_position
            },
            "type": settingBasic.type,
            "is_active": settingBasic.is_active
          }
          let resultCustom = {
            "id": settingCustom.id,
            "theme_options": {
              "title_color": settingCustom.title_color,
              "background_color": settingCustom.background_color,
              "action_color": settingCustom.action_color,
              "content_color": settingCustom.content_color
            },
            "display_option": {
              "display_time": settingCustom.display_time,
              "delay_time": settingCustom.delay_time,
              "is_show_mobile": settingCustom.is_show_mobile,
              "mobile_position": settingCustom.mobile_position,
              "desktop_position": settingCustom.desktop_position
            },
            "type": settingCustom.type,
            "is_active": settingCustom.is_active
          }
          let arrResultSettings = [resultBasic, resultCustom]
          sql.close()
          return res.status(200).json(arrResultSettings);
        }).catch((err) => {
          res.status(500).send({ message: `${err}` });
          sql.close();
        });
      }
      var query = "select * from [setting]";
      executeQuery(res, query)
    }
  },

  getActiveSetting: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  },

  postSetting: async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");

    let body = req.body;
    let title_color = body.title_color;
    let background_color = body.background_color;
    let action_color = body.action_color;
    let content_color = body.content_color;



    let display_time = parseInt(body.display_time);
    let delay_time = parseInt(body.delay_time);
    let is_show_mobile = (body.is_show_mobile === true) || (body.is_show_mobile == 'true') ? 1 : 0;
    let mobile_position = parseInt(body.mobile_position);
    let desktop_position = parseInt(body.desktop_position)
    let is_active = (body.is_active === true || body.is_active === 'true') ? 1 : 0;

    let paramType = req.param('type');

    if (paramType === 'custom' || paramType === 'basic') {
      let executeQuery = function (res, query) {
        new sql.ConnectionPool(dbConfig).connect().then((pool)=>{
          return pool.request().query(query);
        }).then((result)=>{
          let rows = result.recordset;
          res.status(200).json(rows);
          sql.close();
        }).catch((err)=>{
          res.status(500).send({message: `${err}`});
          sql.close();
        });
      }
      // let executeQuery = function (res, query) {
      //   sql.connect(dbConfig, function (err) {
      //     if (err) {
      //       console.log("Error while connecting database :- " + err);
      //       res.send(err);
      //     }
      //     else {
      //       // create Request object
      //       let request = new sql.Request();
      //       // query to the database
      //       request.query(query, function (err, data) {
      //         if (err) {
      //           console.log("Error while querying database :- " + err);
      //           sql.close()
      //           res.send(err);
      //         }
      //         else {
      //           // let result = data.recordsets[0];      
      //           sql.close()
      //           return res.send(data);
      //         }
      //       });
      //     }
      //   });
      // }
      if (paramType === 'custom') {
        let query = `UPDATE setting 
        SET 
          is_active = ${is_active}, 
          title_color = '${title_color}',  
          background_color  = '${background_color}',  
          action_color  = '${action_color}',  
          content_color  = '${content_color}',  
          display_time = ${display_time},  
          delay_time  = ${delay_time},  
          is_show_mobile = ${is_show_mobile},  
          mobile_position = ${mobile_position},  
          desktop_position = ${desktop_position} 
        WHERE 
          type = '${paramType}'`
        executeQuery(res, query)
      } else {
        let query = `UPDATE setting 
        SET 
          is_active = ${is_active}
        WHERE 
          type = '${paramType}'`
        executeQuery(res, query)
      }

    } else {
      return res.send('false')
    }
  },

  putSetting: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let body = req.body;
    let theme_options = {
      title_color: body.title_color,
      background_color: body.background_color,
      action_color: body.action_color,
      content_color: body.content_color
    }

    let display_option = {
      display_time: parseInt(body.display_time),
      delay_time: parseInt(body.delay_time),
      is_show_mobile: body.is_show_mobile,
      mobile_position: parseInt(body.mobile_position),
      desktop_position: parseInt(body.desktop_position)
    }

    await Setting.update({ type: body.type })
      .set({
        theme_options: theme_options,
        display_option: display_option,
        is_active: body.is_active,
      });

    return res.json({ status: '201 created' })


  }

};

