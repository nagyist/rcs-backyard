/**
 * Created by Leonardo Ribeiro on 25/08/2014.
 */
(function() {
  'use strict';

  angular.module('frontend.backyard.adm.expenses')
    .controller('ExpenseViewController',
    [
      '$scope', '$stateParams', 'DataService',
      function($scope, $stateParams, DataService) {
        $scope.activeTab = 'backyard.adm.expenses';
        $scope.expense = {};
        $scope.expenseTypes = {};

        $scope.sum = function(list) {
          var total=0;
          angular.forEach(list , function(item){
            if (item.value) {
              total += parseFloat(item.value);
            }
          });
          return total;
        };

        // Fetch actual data
        DataService.get('expensetype')
          .success(function(res1){
            $scope.expenseTypes = res1;

            DataService.getOne('expense', {id: $stateParams.id})
              .then(function(res2){
                res2.items.forEach(function(data) {
                  data.type = _.find(res1, { 'id': data.type });
                });
                $scope.expense = res2;
              });
          });
      }
    ]
  );
}());