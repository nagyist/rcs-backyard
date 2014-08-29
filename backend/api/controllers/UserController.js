'use strict';

var _ = require('lodash');

/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = _.merge(_.cloneDeep(require('../base/controller')), {

	changePassword: function(request, response) {
        console.log(request.param, request.body);

		var userId = request.param("userId");
        var passwordCurrent = request.param("passwordCurrent");
        var passwordNew = request.param("passwordNew");
        var passwordReType = request.param("passwordReType");

        console.log(passwordNew + ' -- retype:' + passwordReType);

        if (passwordNew !== passwordReType) {
            response.send(400, "Given passwords doesn't match.");
        } else if (passwordNew.length < 6) {
            response.send(400, "Given new password is too short. (Min: 6 chars)");
        } else {
        	sails.models['passport'].findOne({user: userId})
        		.exec(function (err, res) {
        			if (!!err) {
        				return response.send(400, 
        					"Error while changing password, please try later");
        			}

        			res.validatePassword(passwordCurrent, function(err, passMatched) {
                        if(!!err || !passMatched) {
        					return response.send(400, 
        						"Current password doesn't match!");
        				}
        				res.password = passwordNew;
        				res.save(function(err) {
        					if(!!err) {
        						return response.send(400,
        							"Error while changing password, please try later");
        					} else {
        						return response.send(200,"Password changed!");
        					}
        				});
        			});
        			
        		});
        }
	}
});
