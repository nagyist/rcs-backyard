/**
 * Created by Leonardo Ribeiro on 26/08/2014.
 */
(function() {
  'use strict';

  angular.module('frontend.backyard.adm.employees')
    .controller('EmployeeFormController',[
      '$scope', '$modal', '$state', 'DataService',
        'CurrentUser', 'Message', '$stateParams',
      function($scope, $modal, $state, DataService,
        CurrentUser, Message, $stateParams) {
        // Initialize data
        var today = moment().format('YYYY-MM-DD');

        if($stateParams.id) {
          $scope.employee = DataService.get('employee/view',
            {id: $stateParams.id})
          .success(function(res){
            console.log(res);
            $scope.employee = res;
            $scope.user = res.user;
            $scope.edit = true;
          });
        } else {
          $scope.employee = {admissionDate: today,
          birthDate: '1900-01-01'};
          $scope.user = {};
          $scope.positions = [];
          $scope.roles = [];
          $scope.regions = [];
          $scope.password = '';
          $scope.passwordRetype = '';
        }

        DataService.get('position')
          .success(function(res){
            $scope.positions = res;
          });

        DataService.get('role')
          .success(function(res){
            $scope.roles = res;
          });

        DataService.get('region')
          .success(function(res){
            $scope.regions = res;
          });

        $scope.createEmployee = function() {
          if($scope.password !== $scope.passwordRetype) {
            Message.message('Passwords doesn\'t match', {type: 'error'});
            return false;
          }

          DataService.post('employee/create', {
            employee: $scope.employee, user: $scope.user,
            password: $scope.password })
            .success(function(data) {
              Message.message('Employee #'+data.id+' created successfully',
                {type: 'success'});
              $state.go('backyard.adm.employees');
            });
        };

        $scope.updateEmployee = function() {
          DataService.post('employee/update', {
            employee: $scope.employee, user: $scope.user
          }).success(function(data) {
            Message.message('Employee #'+data.id+' updated successfully',
              {type:'success'});
            $state.go('backyard.adm.employee',
              {id: $scope.employee.id});
          });
        };

      }
    ]);
}());
