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
    var workflow = request.param('workflow');
    var steps = request.param('steps');
    var valid = true;

    console.log(workflow);
    console.log(steps);

    if(!workflow || !steps) {
      return response.json(400, "Objects workflow and steps required" );
    }

    if(steps.length < 1) {
      return response.json(400, "At least one step must be filled");
    }

    valid = sails.models['workflow'].isValid(workflow);
    if(typeof valid === 'object') {
      return response.json(400, { error: valid.message });
    }

    valid = sails.models['workflowstep'].isValid(steps);
    if(typeof valid === 'object') {
      return response.json(400, { error: valid.message });
    }

    sails.models['workflow'].create(workflow).exec(function (err1, res1) {
      if(err1) { return response.json(400,err1); }

        steps.forEach(function(data) {
          data.workflow = res1.id;
        });
      
        sails.models['workflowstep'].create(steps).exec(function(err3,res3) {
          if (err3) {
            // rollback workflow object
            sails.models['workflow'].destroy({id:res1.id}).exec(function (err) {
              console.log('Deleting failed creation of expense id '+res1.id);
            });
            return response.json(400,err3)
          };
          
          return response.json(200,res1);
        });
    });
    
  }

});
