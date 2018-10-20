/**
 * BlogsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var sql = require("mssql");

var dbConfig = {
  user: "pgnotify",
  password: "pgnotify@123",
  server: "210.211.124.16",
  database: "PasGo-Notify",
  options: {
    encrypt: false
  }
};

const ChangeToSlug =(chuoi) =>
{
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
module.exports = {
  getAllBlogs: async (req, res) => {
    // let blogs = await Blogs.find();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");

    let keysearch = req.param('keysearch');
    let locations = parseInt(req.param('locations'));
    let locationsSlug = 'ha-noi';
    if(locations === 1){
      locationsSlug = 'ha-noi';
    } else if (locations === 2){
      locationsSlug = 'ho-chi-minh';
    } else {
      locationsSlug = 'da-nang';
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
              for (let i = 0; i < data.recordsets[0].length; i++) {
                const itemBlog = data.recordsets[0][i];
                let catagorySlug = ChangeToSlug(itemBlog.TenDanhMuc);
                let titleSlug = ChangeToSlug(itemBlog.TieuDe);
                blogs.push({
                  "id": itemBlog.Id,
                  "link_blog": 'https://pasgo.vn/blog/' +  locationsSlug + "/" + catagorySlug + "/" + titleSlug + "-" + itemBlog.id,
                  "name_blog": itemBlog.TieuDe
                });
              }        
              
              let result = {
                "blogs": blogs
              }
              sql.close()
              return res.send(result);
            }
          });
        }
      });
    }

    var query = `exec usp_GetLinkBlog ${locations}, '${keysearch}'`;
    executeQuery(res, query)
  },


  postBlog: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let blog = req.body;
    let resultBlog = await Blogs.create(blog).fetch();
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    return res.json(resultBlog);
  },


};

