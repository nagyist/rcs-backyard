'use strict';

/**
 * Employee.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
    schema: true,

    attributes: {
        // Name of the employee
        name: {
            type:       'string',
            required:   true
        },
        // Personal Email
        personalEmail: {
          type:       'email',
          required:   false
        },
        // Birthdate
        birthDate: {
          type:       'date',
          required:   true
        },
        // Admission date
        admissionDate: {
            type:       'date',
            required:   true
        },

        // Below is all specification for relations to another models

        // Position in the company
        position: {
            model: 'position'
        },

        // Region of the country
        region: {
          model: 'region'
        },

      // system user
      // Region of the country
      user: {
        model: 'user'
      }
    }
};

