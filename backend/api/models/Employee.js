(function() {
  'use strict';

  /**
   * Employee.js
   *
   * Employees models - every employee should has an user to do things
   * like create expenses, approve processes etc.
   *
   */
  module.exports = {
    schema: true,

    attributes: {
      // Name of the employee
      name: {
        type: 'string',
        required: true
      },
      // Personal Email
      personalEmail: {
        type: 'email',
        required: false
      },
      // Birthdate
      birthDate: {
        type: 'date',
        required: true
      },
      // Admission date
      admissionDate: {
        type: 'date',
        required: true
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
    },

    // Validate object
    isValid: function(object) {
      var items;

      if (object instanceof Array) {
        items = object;
      } else {
        items = [];
        items.push(object);
      }

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.name) {
          return new Error('Name is obligatory');
        }

        if (!item.birthDate) {
          return new Error('Birth date is obligatory');
        }

        if (!item.admissionDate) {
          return new Error('Admission date is obligatory');
        }
      }

      return true;
    }
  };
})();
