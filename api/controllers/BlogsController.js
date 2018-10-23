
var sql = require("mssql");
const _ = require('lodash');
const config = require('./../../config/env/dbconfig');


const ChangeToSlug = (chuoi) => {
  var slug;
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


const GetAllLinkRestaurantInBlog = (contentBlog) => {
  const urlRegex = require('url-regex');
  let arrLink = contentBlog.match(urlRegex())
  let arrLinkNhaHang = [];
  if (arrLink) {
    for (let i = 0; i < arrLink.length; i++) {
      if (arrLink[i].split('/').length === 5 && arrLink[i].split('/')[3] === "nha-hang") {
        arrLinkNhaHang.push(arrLink[i]);
      }
    }
    arrLinkNhaHang = _.uniq(arrLinkNhaHang);
  }

  return arrLinkNhaHang;
}


module.exports = {
  getAllBlogs: async (req, res) => {
    // let blogs = await Blogs.find();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");

    let keysearch = req.param('keysearch');
    let locationsSlug = req.param('locations');

    let locations = 1;
    if (locationsSlug === 'da-nang') {
      locations = 4;
    } else if (locationsSlug === 'ho-chi-minh') {
      locations = 2;
    } else {
      locations = 1;
    }



    let executeQuery = function (res, query) {
      new sql.ConnectionPool(config.dbConfig).connect().then((pool) => {
        return pool.request().query(query);
      }).then((data) => {

        let blogs = [];
        let arrNoiDung = []
        for (let i = 0; i < data.recordsets[0].length; i++) {
          arrRestaurant = [];
          const itemBlog = data.recordsets[0][i];
          let catagorySlug = ChangeToSlug(itemBlog.TenDanhMuc);
          let titleSlug = ChangeToSlug(itemBlog.TieuDe);
          let contentBlog = itemBlog.NoiDung
          let arrLinkRestaurant = GetAllLinkRestaurantInBlog(data.recordsets[0][i].NoiDung)
          for (let i = 0; i < arrLinkRestaurant.length; i++) {
            let oneLinkRestaurant = arrLinkRestaurant[i];
            arrRestaurant.push(oneLinkRestaurant);
          }
          arrNoiDung.push(contentBlog)
          blogs.push({
            "id": itemBlog.Id,
            "link_blog": 'https://pasgo.vn/blog/' + locationsSlug + "/" + catagorySlug + "/" + titleSlug + "-" + itemBlog.Id,
            "name_blog": itemBlog.TieuDe,
            "arrRestaurant": arrRestaurant
          });
        }
        let result = {
          "blogs": blogs
        }
        res.status(200).json(result);
        sql.close();
      }).catch((err) => {
        res.status(500).send({ message: `${err}` });
        sql.close();
      });
    }

    let query = `exec GetListLinkBlog ${locations}, '${keysearch}'`;
    executeQuery(res, query);

  },


};

