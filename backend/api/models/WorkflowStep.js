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
    type: {
      type:       'string',
      required:   true,
      enum: ['position','user','role']
    },
    // id of the user, position or role
    typeId: {
      type:       'integer',
      required:   true
    },
    // order of the message
    order: {
      type:       'integer',
      required:   true
    },

    // WorkflowObject
    workflow: {
      model: 'Workflow'
    },
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

      if (item.type !== 'position'
        && item.type !== 'role'
        && item.type !== 'user') {
        return new Error('Invalid type');
      }

      if (!item.typeId) {
        return new Error('TypeId is obligatory');
      }

      if (!item.order) {
        return new Error('Order is obligatory');
      }
    }

    return true;
  }
};