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
      required:   true
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
    }
  }
};