'use strict';

/**
 * Expense
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
    schema: true,

    attributes: {
        // Expense type name
        name: {
            type:       'string',
            required:   true
        }
    },

  isValid: function(object) {
    var items;

    if(object instanceof Array) {
      items = object;
    } else {
      items = []; items.push(object);
    }

    for(var i = 0; i < items.length; i++) {
      var item = items[i];
      if (!item.name) {
        return new Error('Name of expense type is required');
      }
    };

    return true;
  }
};

