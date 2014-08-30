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
    // model object name
    model: {
      type:       'string',
      required:   true
    },
    modelId: {
      type: 'integer',
      required: true,
    },
    // text for start message to initiator
    startMessage: {
      type:       'text',
      required:   true
    },
    // text for approval message to approvers
    approverMessage: {
      type:       'text',
      required:   true
    },
    // text for approved message to initiator
    approvedMessage: {
      type:       'text',
      required:   true
    },
    // text for reject message to initiator
    rejectedMessage: {
      type:       'text',
      required:   true
    },
    status: {
      type: 'string',
      required: true,
      enum: ['started', 'finished', 'canceled']
    },

    // workflow object id
    workflow: {
      model: 'Workflow',
      required: true
    },

    // initiator of the wf
    initiator: {
      model: 'User',
      required: true
    },

    items: {
      collection: 'workflowinstanceitem',
      via: 'workflowInstance'
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

      if (!item.model) {
        return new Error('Model is obligatory');
      }

      if (!item.startMessage) {
        return new Error('Start message is obligatory');
      }

      if (!item.approverMessage) {
        return new Error('Approver message is obligatory');
      }

      if (!item.approvedMessage) {
        return new Error('Approved message is obligatory');
      }

      if (!item.rejectedMessage) {
        return new Error('Rejected message is obligatory');
      }

      if (!item.workflow) {
        return new Error('Workflow id is obligatory');
      }

      if (!item.initiator) {
        return new Error('Initiator is null');
      }
    }

    return true;
  }
};