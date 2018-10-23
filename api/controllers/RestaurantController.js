let sql = require("mssql");

const config = require('./../../config/env/dbconfig');

const ChangeToSlug = (chuoi) => {
  let slug;
  //Đổi chữ hoa thành chữ thường
  slug = chuoi.toLowerCase();
  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  //Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, "-");
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  //In slug ra textbox có id “slug”
  return slug;
}
ClearTagHTML = (action_discount) => {
  return action_discount.replace(/<\/?.+?>/ig, '');
}

module.exports = {

  getAllOrRestaurant: async (req, res) => {
      let link_restaurant = req.param('link_restaurant');
      if (link_restaurant) {

        // = : exec GetDetailRestaurant ${getArticleId}
        let getArticleId = link_restaurant.split('-')[link_restaurant.split('-').length - 1];

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');


        let executeQuery = function (res, query) {
          new sql.ConnectionPool(config.dbConfig).connect().then((pool) => {
            return pool.request().query(query);
          }).then((data) => {
            let itemRestaurant = data.recordsets[0][0];
            if (data.recordsets[0].length > 0) {
              let locationsSlug = 'ha-noi';
              if (itemRestaurant.locations === 4) {
                locationsSlug = 'da-nang';
              } else if (itemRestaurant.locations === 2) {
                locationsSlug = 'ho-chi-minh';
              } else {
                locationsSlug = 'ha-noi';
              }

              let result = {
                'link_restaurant': link_restaurant,
                'image': 'http://developer.pasgo.vn/Upload/anh-diem-den/' + ChangeToSlug(itemRestaurant.NDTieuDe) + '-300-' + itemRestaurant.Version + getArticleId + '.jpg',
                'title': itemRestaurant.TitleMeta,
                'content': itemRestaurant.NDTieuDeBaiViet,
                'action_discount': ClearTagHTML(itemRestaurant.NDTaiTro),
                'locations': locationsSlug
              }
              sql.close()
              return res.status(200).json(result);;
            } else {
              sql.close()
              return res.send();
            }
          }).catch((err) => {
            res.status(500).send({
              message: `${err}`
            });
            sql.close();
          });
        }
        let query = `exec GetDetailRestaurant ${getArticleId}`;
        executeQuery(res, query)
      } else {
        let restaurants = await RestaurantSetting.find();
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        return res.json({
          restaurants: restaurants
        });
      }
    },

    getOneRestaurantSetting: async (req, res) => {
        let link_restaurant = req.param('link_restaurant');
        if (link_restaurant) {
          let query = {
            link_restaurant: link_restaurant
          }
          let restaurant = await RestaurantSetting.findOne(query)
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Headers', 'Content-Type');
          res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

          return res.json(restaurant);
        } else {
          let restaurants = await RestaurantSetting.find();
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          return res.json(restaurants);
        }

      },

      postRestaurant: async (req, res) => {

          let restaurantBody = req.body;
          if (restaurantBody.is_active === 'true' || restaurantBody.is_active === 'false') {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

            let link_restaurant = restaurantBody.link_restaurant;
            let image = restaurantBody.image;
            let title = restaurantBody.title;
            let content = restaurantBody.content;
            let action_discount = restaurantBody.action_discount;
            let locations = restaurantBody.locations;
            let is_active = (req.body.is_active === 'true' || req.body.is_active === true) ? 1 : 0;
            let sortId = parseInt(req.body.sortId);
            let executeQuery = function (res, query) {
              new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
                return pool.request().query(query);
              }).then((data) => {
                let result = data.recordsets[0][0];
                sql.close();
                return res.status(200).json(result);
              }).catch((err) => {
                res.status(500).send({
                  message: `${err}`
                });
                sql.close();
              });
            }
            let query = `
              If Not Exists(select * from restaurant where link_restaurant='${link_restaurant}')
              Begin
                INSERT INTO restaurant (link_restaurant, image, title, content, action_discount, locations, is_active, sortId )  
                VALUES 
                  ('${link_restaurant}', '${image}', N'${title}', N'${content}', N'${action_discount}', '${locations}', ${is_active}, ${sortId})
                SELECT * FROM restaurant WHERE id = SCOPE_IDENTITY()
              End
              Else
                UPDATE restaurant SET title = N'${title}', content = N'${content}', action_discount = N'${action_discount}', locations = '${locations}' WHERE link_restaurant='${link_restaurant}'
                SELECT * FROM restaurant WHERE link_restaurant='${link_restaurant}'
            `
            executeQuery(res, query)
          } else {
            return res.json({
              status: 'false'
            })
          }
        },

        putRestaurant: async (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

            let id = req.param('id');
            let executeQuery = function (res, query) {
              new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
                return pool.request().query(query);
              }).then((data) => {
                let result = data;
                sql.close();
                return res.status(200).json(result);
              }).catch((err) => {
                res.status(500).send({
                  message: `${err}`
                });
                sql.close();
              });
            }

            let query = `EXEC UpdateNotifyBlogs ${id}`;
            executeQuery(res, query)


            // let query = { id: id }
            // let restaurant = await RestaurantSetting.findOne(query);
            // let is_active = restaurant.is_active;

            // await RestaurantSetting.update(query)
            //   .set({ is_active: !is_active });
            // return res.json({ update: 'ok' })

          },


          sortRestaurant: async (req, res) => {

            let objSortId = req.body;
            let arrSortId = objSortId.updateSordId;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');


            let executeQuery = function (res, query) {

              new sql.ConnectionPool(config.dbConfigSetting).connect().then((pool) => {
                return pool.request().query(query);
              }).then((result) => {
                sql.close();
                return res.status(200).json({
                  update: 'ok'
                });
              }).catch((err) => {
                res.status(500).send({
                  message: `${err}`
                });
                sql.close();
              });
            }
            arrSortId.forEach(element => {
              let query = `EXEC SortNotifyBlogs ${element.id}, ${element.sortId}`;
              executeQuery(res, query);
            });
          },
};
