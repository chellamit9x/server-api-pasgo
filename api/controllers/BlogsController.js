/**
 * BlogsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


// use [PasGo-Notify]
// SELECT DoiTacKhuyenMai.TitleMeta, DoiTacKhuyenMai.NDTieuDeBaiViet, DoiTacKhuyenMai.TieuDe, ChiNhanhDoiTac.TinhId, DoiTacKhuyenMai.NDTieuDe, AnhDoiTacKhuyenMai.Version 
// FROM DoiTacKhuyenMai
// FULL OUTER JOIN NhomCNDoiTac ON DoiTacKhuyenMai.Id = NhomCNDoiTac.DoiTacKhuyenMaiId 
// FULL OUTER JOIN ChiNhanhDoiTac ON ChiNhanhDoiTac.Id = NhomCNDoiTac.Id  
// FULL OUTER JOIN AnhDoiTacKhuyenMai ON AnhDoiTacKhuyenMai.DoiTacKhuyenMaiId = DoiTacKhuyenMai.Id
// WHERE ArticleId=1990
//= : exec GetDetailRestaurant 1990
//let getArticleId = oneLinkRestaurant.split('-')[oneLinkRestaurant.split('-').length-1];             
// 

var sql = require("mssql");
const _ = require('lodash');
var dbConfig = {
  user: "pgnotify",
  password: "pgnotify@123",
  server: "210.211.124.16",
  database: "PasGo-Notify",
  options: {
    encrypt: false
  }
};



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
  for (let i = 0; i < arrLink.length; i++) {
    if (arrLink[i].split('/').length === 5 && arrLink[i].split('/')[3] === "nha-hang") {
      arrLinkNhaHang.push(arrLink[i]);
    }
  }
  arrLinkNhaHang = _.uniq(arrLinkNhaHang);
  return arrLinkNhaHang;
}


module.exports = {
  getAllBlogs: async (req, res) => {
    // let blogs = await Blogs.find();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");

    let keysearch = req.param('keysearch');
    let locations = parseInt(req.param('locations'));
    let locationsSlug = 'ha-noi';
    if (locations === 4) {
      locationsSlug = 'da-nang';
    } else if (locations === 2) {
      locationsSlug = 'ho-chi-minh';
    } else {
      locationsSlug = 'ha-noi';
    }

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
              sql.close()
              let result = {
                "blogs": blogs
              }
              return res.send(result);
            }
          });
        }
      });
    }

    var query = `exec GetListLinkBlog ${locations}, '${keysearch}'`;
    executeQuery(res, query);
    
  },


};

