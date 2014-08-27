/**
 * Created by Leonardo Ribeiro on 26/08/2014.
 */
(function() {
  'use strict';

  angular.module('frontend.backyard.adm.expenses')
    .controller('ExpenseController',[
      '$scope', '$modal', '$state', 'DataService', 'CurrentUser', 'Message',
      function($scope, $modal, $state, DataService, CurrentUser, Message) {
        // Initialize data
        var today = moment().format('YYYY-MM-DD');
        $scope.expense = {
          desiredPaymentDate: today
        };
        $scope.expenseItems = [{date: today, value: 0}];
        $scope.employee = {};
        $scope.expenseTypes = [];
        $scope.activeTab = 'backyard.adm.expenses';
        $scope.user = CurrentUser.user();

        $scope.sum = function(list) {
          var total=0;
          angular.forEach(list , function(item){
            if (item.value) {
              total += parseInt(item.value);
            }
          });
          return total;
        };

        DataService.getOne('employee', {where: {user: $scope.user.id}})
          .then(function(res){
            $scope.employee = res;
          });

        DataService.get('expensetype')
          .success(function(res){
            $scope.expenseTypes = res;
          });

        $scope.addItem = function() {
          $scope.expenseItems.push({date: today, value: 0});
        };
        $scope.removeItem = function(index) {
          if ($scope.expenseItems.length <= 1) {
            return Message.message('At least one item is required',
              {type: 'warning'});
          }
          $scope.expenseItems.splice(index,1);
        };

        $scope.createExpense = function() {

          if(!$scope.expense.isAdvancedPayment) {
            $scope.expense.desiredPaymentDate = null;
          }

          $scope.expense.employee = $scope.employee.id;
          $scope.expense.status = 'pending';

          DataService.post('expense', $scope.expense)
            .success(function(data) {
              console.log('success');
              console.log(data);
            })
            .error(function(err) {
              console.log('error');
              console.log(err);
            });
        };
      }
    ]);
}());