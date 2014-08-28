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
    // Description of expense
    description: {
      type:       'string',
      required:   true
    },
    // notes
    notes: {
      type:       'text',
      required:   false
    },
    // Preview payment date
    desiredPaymentDate: {
      type:       'date',
      required:   false
    },
    // Preview payment date
    previewPaymentDate: {
      type:       'date',
      required:   false
    },
    // Preview payment date
    isAdvancedPayment: {
      type:       'boolean',
      required:   false
    },
    // Status
    status: {
      type:       'string',
      required:   true,
      enum: ['pending', 'approved', 'rejected']
    },

    /* Below is all specification for relations to another models */
    // Solicitant employee
    employee: {
      model: 'employee'
    },

    items: {
      collection: 'expenseitem',
      via: 'expense'
    },

    /* Attr methods */
    total: function() {
      var query = 'SELECT sum(value) FROM expenseitem WHERE expense = %s;';
      query.replace('%s', this.id);
      console.log(query);
      sails.models['expenseitem'].query(query, function(err, res) {
        if (err) return err;
        console.log(res);
        return res;
      });
    }
  },


  // Validate an expense or an array of expenses
  isValid: function(object) {
    var items;

    if(object instanceof Array) {
      items = object;
    } else {
      items = []; items.push(object);
    }

    for(var i = 0; i < items.length; i++) {
      var item = items[i];
      if (!item.description) {
        return new Error('Description is obligatory');
      }

      if (item.isAdvancedPayment && !item.desiredPaymentDate) {
        return new Error('Desired payment date is obligatory');
      }

      if (!item.status) {
        return new Error('Status is obligatory');
      }
    }

    return true;
  }

};