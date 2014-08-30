(function() {
  'use strict';

  var _ = require('lodash');

  /**
   * EmployeeController
   *
   * @description :: Server-side logic for managing Employees
   *
   */
  module.exports = _.merge(_.cloneDeep(require('../base/controller')), {

    create: function(request, response) {

      var employee = request.param('employee');
      var user = request.param('user');
      var password = request.param('password');
      var passport = {};
      var valid = true;

      console.log('creating employee...');
      console.log(employee);

      console.log('user');
      console.log(user);

      console.log('password');
      console.log(password);

      if (!employee || !user || !password) {
        return response.json(400, 'Objects employee, user, ' +
          'and password required');
      }

      valid = sails.models.user.isValid(user);
      if (typeof valid === 'object') {
        return response.json(400, {
          error: valid.message
        });
      }

      valid = sails.models.employee.isValid(employee);
      if (typeof valid === 'object') {
        return response.json(400, {
          error: valid.message
        });
      }

      passport.password = password;
      passport.protocol = 'local';

      valid = sails.models.passport.isValid(passport);
      if (typeof valid === 'object') {
        return response.json(400, {
          error: valid.message
        });
      }

      sails.models.user.create(user).exec(function(err1, res1) {
        if (err1) {
          return response.json(400, err1);
        }

        passport.user = res1.id;

        sails.models.passport.create(passport).exec(function(err2, res2) {
          if (err2) {
            sails.models.user.destroy(res1);
            return response.json(400, err2);
          }

          employee.user = res1.id;

          sails.models.employee.create(employee).exec(function(err3, res3) {
            if (err3) {
              sails.models.user.destroy(res1);
              sails.models.passport.destroy(res2);
              return response.json(400, err3);
            }

            return response.json(200, res3);
          });
        });
      });
    },

    view: function(request, response) {

      // @to-do: temporary code --> to be removed!
      var id = request.param('id');

      if (!id) {
        return response.json(400, 'Employee id required');
      }

      sails.models.employee.findOne(id)
        .populate('user')
        .exec(function(err, res) {
          if (err || !res) {
            return response.json(400, 'User not found');
          }

          // real code
          var username = res.user.username; //request.param('username');

          if (!username) {
            return response.json(400, 'Username required');
          }

          sails.models.user.findOne({
            username: username
          })
            .populate('roles')
            .populate('logins')
            .exec(function(err1, res1) {
              if (err1 || !res1) {
                return response.json(400, 'User not found');
              }

              sails.models.employee.findOne({
                user: res1.id
              })
                .populate('position')
                .populate('region')
                .exec(function(err2, res2) {
                  if (err2 || !res2) {
                    return response.json(400, 'Employee not found');
                  }

                  res2.user = res1;

                  return response.json(200, res2);
                });
            });
        });
    }

  });
}());
