/**
 * Workflow.js
 *
 * Workflow objects represents a setup of a workflow instance and messages steps.
 * Every workflow has a Model and positions.
 * Each position receives a message for approval/repproval the model status.
 * The initiator receive the worfklow start message and the approval/repproval message.
 * 
 */
module.exports = {
  schema: true,

  attributes: {
    // type of the step
    stepType: {
      type:       'string',
      required:   true,
      enum: ['position','user','role']
    },
    // id of the user, position or role
    stepTypeId: {
      type:       'integer',
      required:   true
    },
    // model object name
    stepNumber: {
      type:       'integer',
      required:   true
    },
    // text for start message to initiator
    status: {
      type:       'string',
      required:   true,
      enum: ['waiting', 'started', 'finished', 'canceled']
    },
    action: {
      type: 'string',
      required: false,
      enum: ['approved', 'rejected']
    },

    // text of the action
    text: {
      type:       'string',
      required:   false
    },

    // workflow object id
    workflowInstance: {
      model: 'WorkflowInstance',
      required: true
    },

    // agent of the action
    agent: {
      model: 'User',
      required: false
    },

    // attribute methods
    getRecipients: function(cb) {
      switch (this.stepType) {
          case 'user':
              sails.models['user'].findOne({id: this.stepTypeId})
                .exec(cb);
              break;
          case 'position':
              sails.models['position'].findOne({id: this.stepTypeId})
                .populate('employees')
                .exec(function(err, res) {
                  if(err || !res) {
                    cb(new Error('employees not found for position'));
                    return false;
                  }

                  var users = [];
                  res.employees.forEach(function(data) {
                    users.push(data.user);
                  });

                  sails.models['user'].find({id: users})
                    .exec(cb);
                });
              break;
          case 'role':
              sails.models['role'].findOne({id: this.stepTypeId})
                .populate('users')
                .exec(function(err,res) {
                  if(err || !res) {
                    return cb(new Error('users not found for role'));
                  }

                  var users = res.users;
                  return cb(err, users);
                })
              break;
      }
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

      if (!item.stepNumber) {
        return new Error('StepNumber is obligatory');
      }

      if (item.stepType !== 'position'
        && item.stepType !== 'role'
        && item.stepType !== 'user') {
        return new Error('Invalid step type');
      }

      if (!item.stepTypeId) {
        return new Error('Step Type Id is obligatory');
      }

      if (!item.status) {
        return new Error('Status is null');
      }

      if(item.action && (item.action!== 'approved'
        || item.action!== 'rejected')) {
        return new Error('Invalid action');
      }
    }

    return true;
  }
};