'use strict';

var workflow = {};

workflow.trigger = function(newRecord, initiator) {

	console.log('Triggering workflow for process ??? #'+newRecord.id);


	// check if the model has active workflow
	sails.models['workflow'].find({model: 'Expense', isActivated: true})
		.populate('steps')
		.exec(function(err, res) {
			if(err || !res.length) {
				console.log('Process ??? doesnt have any active workflow');
				return false;
			}

			console.log('Workflow retrieved:');
			console.log(res);

			res.forEach(function(resData) {

				if(resData.triggerStatus !== newRecord.status) {
					console.log('Process ??? doesnt has the trigger status');
					return false;
				}

				// check if the model hasn't an active workflow for the object
				sails.models['workflowinstance'].findOne({workflow: resData.id, 
					model: resData.model,
					modelId: newRecord.id,
					status: 'started'})
					.exec(function (err1, res1) {
					if(res1) {
						console.log('Process ??? #'+newRecord.id+' is already running a workflow');
						return false;
					}
				
					// create a workflow instance
					console.log('Creating a workflow instance for process ??? #'+newRecord.id);
					var workflowInstance = {
						workflow:         resData.id,
						model:         	  resData.model,
						modelId:          newRecord.id,
						startMessage:     resData.startMessage,
						approverMessage:  resData.approverMessage,
						approvedMessage:  resData.approvedMessage,
						rejectedMessage:  resData.rejectedMessage,
						status:           'started',
						initiator:        initiator.id // to-do: how to recover the actual request user?
					}

					sails.models['workflowinstance'].create(workflowInstance)
						.exec(function (err2,res2) {
							if(err2) {
								console.log('Error occurred while creating the wf instance');
								return new Error('An error has occurred starting wf.');
							}

							console.log('Created wf instance:');
							console.log(res2);

							var workflowInstanceItems = [];
							resData.steps.forEach(function(data) {
								var item = { }
								item.workflowInstance = res2.id;
								item.stepNumber = data.order;
								item.stepType = data.type;
								item.stepTypeId = data.typeId;
								item.status = (data.order === 1) ? 'started' : 'waiting';
								item.action = null;
								item.agent = null;
								workflowInstanceItems.push(item);
							});

							sails.models['workflowinstanceitem'].create(workflowInstanceItems)
								.exec(function (err3,res3) {
									// error while steps: rollback workflow
									if(err3) {
										sails.models['workflowinstance'].destroy(res3);
										return false;
									}

									console.log('Created wf instance items:');
									console.log(res3);

									res2.items = res3;

									// workflow and steps created successfully
									// send initial messages
									workflow.message('start', res2, function(err,res) {
										if(err) {
											return err;
										}
										workflow.message('approver', res2, 
											function(err,res) {
												if(err) {
													return err;
												}
												console.log('Workflow triggered successfully');
												return true;
										});
									});

								});
						});
				});
			});
		});
}

workflow.approve = function(workflowInstanceId, userId, cb) {

	console.log('Approving wf instance '+workflowInstanceId+' with user '+userId);

	if(!workflowInstanceId) {
		cb(new Error('There\'s no workflow instance id detected'));
		return false;
	}

	if(!userId) {
		cb(new Error('There\'s no user detected'));
		return false;
	}

	sails.models['workflowinstance'].findOne(workflowInstanceId)
		.populate('items')
		.exec(function (err,res) {
		if(err || !res) {
			console.log('Error while selecting wf id '+workflowInstanceId);
			cb(err);
			return false;
		}

		// get current step
		var currentStep;
		currentStep = _.find(res.items, { status: 'started' });
		if(!currentStep) {
			console.log('Error while selecting current step');
			cb(new Error('Current step not found'));
			return false;
		}
		console.log('Current step:');
		console.log(currentStep);

		// finish current step
		currentStep.action = 'approved';
		currentStep.agent = userId;
		currentStep.status = 'finished';
		sails.models['workflowinstanceitem'].update(currentStep.id,
			{ 
				agent: currentStep.agent, 
				status: currentStep.status, 
				action: currentStep.action
			}, function(err, itemUpdated) {
				if(err) {
					console.log('Error while updating current step:');
					console.log(err);
				} else {
					console.log('Updated current step:');
					console.log(itemUpdated);

					// get next step
					console.log('Checking for next step...');
					var nextStep;
					nextStep = _.find(res.items, { status: 'waiting' });
					if(!nextStep) {
						console.log('Next step not found.');
						// workflow finished
						workflow.finish(workflowInstanceId);
						workflow.message('approved',res, cb);
					} else {
						// start next step and send approval msg
						console.log('Next step found:');
						console.log(nextStep);
						nextStep.status = 'started';
						sails.models['workflowinstanceitem'].update(nextStep.id,
							{status: nextStep.status},
							function(err, itemUpdated) {
								if(err) {
									cb(err);
									return false;
								}
								console.log('Updated next step:');
								console.log(itemUpdated);
								workflow.message('approver',res, cb);
							});
					}
				}
			}
		);

		

	});
}

workflow.reject = function(workflowInstanceId, userId, text, cb) {

	console.log('Rejecting wf instance '+workflowInstanceId+' with user '+userId);
	console.log('Reject reason text: \n '+text);

	if(!workflowInstanceId) {
		cb(new Error('There\'s no workflow instance id detected'));
		return false;
	}

	if(!userId) {
		cb(new Error('There\'s no user detected'));
		return false;
	}

	if(!text) {
		cb(new Error('There\'s no reject reason text detected'));
		return false;
	}

	sails.models['workflowinstance'].findOne(workflowInstanceId)
		.populate('items')
		.exec(function (err,res) {
		if(err || !res) {
			console.log('Error while selecting wf id '+workflowInstanceId);
			cb(err);
			return false;
		}

		// get current step
		var currentStep;
		currentStep = _.find(res.items, { status: 'started' });
		if(!currentStep) {
			console.log('Error while selecting current step');
			cb(new Error('Current step not found'));
			return false;
		}		
		console.log('Current step:');
		console.log(currentStep);

		// finish current step
		currentStep.action = 'rejected';
		currentStep.agent = userId;
		currentStep.status = 'finished';
		sails.models['workflowinstanceitem'].update(currentStep.id,
			{ 
				agent: currentStep.agent, 
				status: currentStep.status, 
				action: currentStep.action,
				text: text
			}, function(err, itemUpdated) {
				if(err) {
					console.log('error while updating workflow instance item');
					console.log(err);
				} else {
					console.log('Updated current step:');
					console.log(itemUpdated);

					// finish workflow
					workflow.finish(workflowInstanceId);

					// workflow finished
					workflow.message('rejected',res, cb);	
				}
			}
		);

			

	});
}

workflow.finish = function(workflowInstanceId) {
	console.log('Finishing workflow instance id #' + workflowInstanceId);

	sails.models['workflowinstance'].findOne(workflowInstanceId)
		.exec(function (err,res) {
		if(err || !res) {
			console.log('Error while searching for workflow instance');
			console.log(err);
			return false;
		}

		sails.models['workflowinstanceitem'].update(
			{workflowInstance: res.id, action: null}, {status: 'finished'})
			.exec(function(err1, res1) {
				if(err1) {
					console.log('Error while updating workflow instance items');
					console.log(err);
				} else {
					res.status = 'finished';
					res.save(function(err) {
						if(err) {
							console.log('Error while saving workflow instance');
							console.log(err);
						} else {
							console.log('Workflow instance finished successfully!');
						}			
					});
				}				
			});	

	});
}

workflow.cancel = function(workflowInstanceId) {
	console.log('Cancelling workflow instance id #' + workflowInstanceId);

	sails.models['workflowinstance'].findOne(workflowInstanceId)
		.populate('items')
		.exec(function (err,res) {
		if(err || !res) {
			console.log('Error while searching for workflow instance');
			console.log(err);
			return false;
		}

		res.items.forEach(function(data) {
			if(!data.action) {
				data.status = 'cancelled';
			}
		});
		res.status = 'finished';
		res.save(function(err) {
			if(err) {
				console.log('Error while cancelling workflow instance');
			} else {
				console.log('Workflow instance canceled successfully!');
			}			
		});

	});
}

workflow.message = function(type, workflowInstance, cb) {
	console.log('Start message process...');
	console.log('Message type: '+type);
	console.log('Workflow instance object:');
	console.log(workflowInstance);

	if(!type || !workflowInstance) {
		cb(new Error('There\'s no type or workflowinstance detected'));
		return false;
	}

	// get current step
	var currentStep;
	if(type === 'approved' || type === 'rejected') {
		currentStep = _.last(workflowInstance.items);
	} else {
		currentStep = _.find(workflowInstance.items, { status: 'started' });
	}	
	if(!currentStep) {
		console.log('Current step not found');
		cb(new Error('Current step not found'));
		return false;
	}
	console.log('Current step found:');
	console.log(currentStep);


	var message;
	var subject;	

	switch(type) {
		case 'start':
			subject = '[RCS] Backyard - Started process ' + workflowInstance.model
				+ ' #' + workflowInstance.modelId;
			message = workflowInstance.startMessage;
			break;
		case 'approver':

			// approval url @to-do: correct setup of env url!
			var envUrl = 'http://localhost:3001/'
			var modelUrl = 'wf/' + workflowInstance.model + '/' + workflowInstance.modelId;

			subject = '[RCS] Backyard - Approve process ' + workflowInstance.model
				+ ' #' + workflowInstance.modelId;
			message = workflowInstance.approverMessage;
			message = message + '\n Approval link: ' + envUrl + modelUrl;
			break;
		case 'approved':
			subject = '[RCS] Backyard - '+ workflowInstance.model
				+ ' #' + workflowInstance.modelId + 'Process Approved';
			message = workflowInstance.approvedMessage;
			break;
		case 'rejected':
			subject = '[RCS] Backyard - '+ workflowInstance.model
				+ ' #' + workflowInstance.modelId + 'Process Rejected';
			message = workflowInstance.rejectedMessage;
			message = message + '\n Reject reason: \n ' + currentStep.text;
			break;
		default:
			cb(new Error('invalid message type'));
			return false;
	}
	message = message + '\n \n *** THIS IS AN AUTOMATIC MESSAGE, PLEASE DON\'T REPLY ***';

	console.log('Setted subject: '+subject);
	console.log('Setted message: \n'+message);

	// check the recipient by messageType
	var recipients = [];
	if(type === 'start' 
		|| type === 'approved'
		|| type === 'rejected') {
		sails.models['user'].findOne({id:workflowInstance.initiator})
			.exec(function (err,res) {
				if(err || !res) {
					console.log('error while loading recipient initiator');
					cb(new Error('error while loading recipient'));
					return false;
				}

				console.log('initiator recipient:');
				console.log(res);

				recipients.push(res);				
				workflow.sendMessage(recipients,subject,message,cb);
			});
	} else if (type === 'approver') {		
		currentStep.getRecipients(function(err,res){
			if(err) {
				console.log('error while loading approver recipients');
				cb(new Error('error while loading recipient'));
				return false;
			}

			console.log('approver recipients:');
			console.log(res);
				
			recipients = res;
			workflow.sendMessage(recipients,subject,message,cb);			
		});
		
	}
}

workflow.sendMessage = function(recipients,subject,message,cb) {
	console.log("Sending workflow messages...");

	recipients.forEach(function(data, index){
		// to-do: insert mail send function... sendgrid?
		console.log('Sending message #'+ index+1);
		console.log('Recipient: '+ data.email);
		console.log('Subject: '+ subject);
		console.log('Message: '+ message);
	});

	cb(null, 'Workflow messages sent successfully!')
}

module.exports = workflow;