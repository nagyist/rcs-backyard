/**
 * Created by Leonardo Ribeiro on 26/08/2014.
 */
/**
 * Expense.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  schema: true,

  attributes: {
    // nf number
    number: {
      type:       'string',
      required:   false
    },
    // nf value
    value: {
      type:       'float',
      required:   true
    },
    // nf date
    date: {
      type:       'date',
      required:   true
    },

    /* Below is all specification for relations to another models */
    // Solicitant employee
    expense: {
      model: 'Expense'
    },
    type: {
      model: 'ExpenseType',
      required: true
    }
  },

  // Validate all objects
  isValid: function(object) {
    var items;

    if(object instanceof Array) {
      items = object;
    } else {
      items = []; items.push(object);
    }

    for(var i = 0; i < items.length; i++) {
      var item = items[i];
      if (!item.value || item.value < 1) {
        return new Error('Min value is $ 1.00');
      }

      if (!item.date) {
        return new Error('Date is obligatory');
      }
    }

    return true;
  }
};