/**
 * Setting.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    theme_options:{
      type: 'json',
    },
    display_option: {
      type: 'json',
    },
    type: {
      type: 'string'
    },
    is_active: {
      type: 'boolean'
    },


  },

};

