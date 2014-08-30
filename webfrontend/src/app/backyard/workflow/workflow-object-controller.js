/**
 * Created by Leonardo Ribeiro on 28/08/2014.
 */
(function() {
  'use strict';

  angular.module('frontend.backyard.workflow')
    .controller('WorkflowObjectController',[
      '$scope', '$modal', '$state', 'DataService', 'CurrentUser', 'Message',
      function($scope, $modal, $state, DataService, CurrentUser, Message) {
        // Initialize data
        $scope.workflowSteps = [{selectedPosition: true, order: 1}];
        $scope.workflowSteps.sort(function(a, b) { 
		      return b.order - a.order;
		    });
        $scope.workflow = {};
        $scope.user = CurrentUser.user();
        $scope.positions = [];
        $scope.users = [];
        $scope.roles = [];
        $scope.models = ['Employee', 'Expense'];

        DataService.get('position')
          .success(function(res){
            $scope.positions = res;
            console.log(res);
          });

        DataService.get('user')
          .success(function(res){
            $scope.users = res;
            console.log(res);
          });

        DataService.get('role')
          .success(function(res){
            $scope.roles = res;
            console.log(res);
          });

        $scope.addItem = function() {
        	$scope.workflowSteps.sort();
        	var last = _.last($scope.workflowSteps);
          	$scope.workflowSteps.push({selectedPosition: true, order: last.order+1});
        };
        $scope.removeItem = function(index) {
          if ($scope.workflowSteps.length <= 1) {
            return Message.message('At least one item is required',
              {type: 'warning'});
          }
          $scope.workflowSteps.splice(index,1);
          $scope.workflowSteps.sort();
          for(var i=0;i<$scope.workflowSteps.length;i++) {
          	$scope.workflowSteps[i].order = i + 1;
          }
        };

        $scope.updateShowTypes = function(index) {          
          if($scope.workflowSteps[index].type === 'position') {
            $scope.workflowSteps[index].selectedPosition = true;
            $scope.workflowSteps[index].selectedUser = false;
            $scope.workflowSteps[index].selectedRole = false;
          } else if ($scope.workflowSteps[index].type === 'role') {
            $scope.workflowSteps[index].selectedPosition = false;
            $scope.workflowSteps[index].selectedUser = false;
            $scope.workflowSteps[index].selectedRole = true;
          } else if ($scope.workflowSteps[index].type === 'user') {
            $scope.workflowSteps[index].selectedPosition = false;
            $scope.workflowSteps[index].selectedUser = true;
            $scope.workflowSteps[index].selectedRole = false;
          }
        };

        $scope.createWorkflow = function() {

          DataService.post('workflow/create', 
            { workflow: $scope.workflow, steps: $scope.workflowSteps })
            .success(function(data) {
              Message.message('Workflow object #'+data.id+' created with success',
                {type: 'success'});
              $state.go('backyard.workflows');
            });
        };
      }
    ]);
}());