/**
 * ArticleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  getAllArticles: async (req, res) => {
    let articles = await Articles.find().populate('arr_restaurant');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return res.json(articles);
  },

  postArticle: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let article = req.body;

    let resultArticles = await Articles.findOrCreate({ link_article: article.link_article }, { link_article: article.link_article, name_article: article.name_article });
    let idRs = resultArticles.id;
    //format type


    let t = {
      link_restaurant: article.link_restaurant,
      image: article.image,
      title: article.title,
      content: article.content,
      action_discount: article.action_discount,
      is_active: article.is_active,
      articles: idRs
    }

    await Article.create(t);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    return res.json({ status: "201 created" });

  },

  putArticle: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    let id = req.param('id');
    let query = { id: id }
    let article = await Article.findOne(query);
    let is_active = article.is_active;

    await Article.update(query)
      .set({ is_active:  !is_active});
    return res.json({update: 'ok'})
  },



};

