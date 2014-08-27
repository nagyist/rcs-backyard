/**
 * Created by Leonardo Ribeiro on 25/08/2014.
 */
(function() {
  'use strict';

  angular.module('frontend.backyard.adm.employees')
    .controller('EmployeeController',
    [
      '$scope', '$stateParams', 'DataService',
      function($scope, $stateParams, DataService) {
        $scope.activeTab = 'backyard.adm.employees';
        $scope.employee = {};

        // Fetch actual data
        DataService.getOne('employee', {id: $stateParams.id})
          .then(function(res){
            $scope.employee = res;
          });
      }
    ]
  );
}());