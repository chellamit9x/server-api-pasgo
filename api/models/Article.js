/**
 * Article.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    link_restaurant: {
      type: 'string'
    },
    image:{
      type: 'string'
    },
    title: {
      type: 'string'
    },
    content: {
      type: 'string'
    },
    action_discount: {
      type: 'string'
    },

    is_active: {
      type: 'boolean'
    },

    articles: {
      model: 'articles'
    }


  },

};

