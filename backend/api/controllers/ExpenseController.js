'use strict';

var _ = require('lodash');

/**
 * EmployeeController
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = _.merge(_.cloneDeep(require('../base/controller')), {

  create: function(request, response) {
    var count = 0;
    var expense = request.body.expense;
    var items = request.body.items;
    var types = [];
    var valid = true;

    items.forEach(function(item) {
      types.push({name: item.type});
    });

    if(!expense || !items) {
      valid = new Error("Objects Expense and Items required");
      return response.json(400, { error: valid.message } );
    }

    if(items.length < 1) {
      valid = new Error("At least one item must be filled");
      return response.json(400, { error: valid.message });
    }

    valid = sails.models['expense'].isValid(expense);
    if(typeof valid === 'object') {
      return response.json(400, { error: valid.message });
    }

    valid = sails.models['expensetype'].isValid(types);
    if(typeof valid === 'object') {
      return response.json(400, { error: valid.message });
    }

    valid = sails.models['expenseitem'].isValid(items);
    if(typeof valid === 'object') {
      return response.json(400, { error: valid.message });
    }

    sails.models['expense'].create(expense).exec(function (err1, res1) {
      if(err1) { return response.json(400,err1); }
      items.forEach(function (item){
        sails.models['expensetype'].findOrCreate({name:item.type},{name:item.type}).exec(function (err2, res2) {

          if(err2) {
            sails.models['expense'].destroy({id:res1.id}).exec(function (err) {
              console.log('Deleting failed creation of expense id '+res1.id);
            });
            return response.json(400,err2);
          }

          items[count].type = res2.id;
          items[count].expense = res1.id;

          count++;

          if (count >= items.length) {
            sails.models['expenseitem'].create(items).exec(function(err3,res3) {
              if (err3) {return response.json(400,err3)};

              res1.expenses = res3;

              sails.models['expense'].findOne(res1.id).populate('items')
                .exec(function (err,res) {
                  if (err) {return response.json(400,err)};
                  return response.json(200,res);
                });
            });
          }
        })
      });
    });
  }

});
