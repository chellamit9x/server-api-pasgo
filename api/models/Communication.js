/**
 * Communication.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    image: {
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
    link_communication: {
      type: 'string'
    },
    category: {
      type: 'string'
    },
    is_active: {
      type: 'boolean'
    },
    locations: {
      type: 'string'
    },
    sortId: {
      type: 'number',
    },


  },

};

