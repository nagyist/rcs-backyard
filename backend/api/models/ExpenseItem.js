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
      required:   true
    },
    // notes
    value: {
      type:       'text',
      required:   true
    },
    // nf date
    date: {
      type:       'date',
      required:   false
    },

    /* Below is all specification for relations to another models */
    // Solicitant employee
    type: {
      model: 'ExpenseType'
    }
  }
};