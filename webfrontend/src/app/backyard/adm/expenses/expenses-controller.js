/**
 * Just an example controller to list all books.
 */
(function() {
  'use strict';

  angular.module('frontend.backyard.adm.expenses')
    .controller('ExpensesController',
    [
      '$scope', '$modal', 'DataService', 'CurrentUser',
      function($scope, $modal, DataService, CurrentUser) {
        // Initialize data
        $scope.user = CurrentUser.user();
        $scope.employee = {};
        $scope.endPoint = 'expense';
        $scope.itemCount = 0;
        $scope.items = [];
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        $scope.activeTab = 'backyard.adm.expenses';
        $scope.loading = true;
        $scope.loaded = false;
//        $scope.roles = $scope.user.roles;

        // Initialize used title items
        $scope.titleItems = [
          {title: 'Id', column: 'id', width: '10%'},
          {title: 'Date', column: 'createdAt', width: '15%'},
          {title: 'Description', column: 'description', width: '25%'},
          {title: 'Total', column: false, width: '20%'},
          {title: 'Payment Preview Date', column: 'previewPaymentDate', width: '15%'},
          {title: 'Status', column: 'status', class:'text-right', width: '15%'}
        ];

        // Initialize default sort data
        $scope.sort = {
          column: 'createdAt',
          direction: false
        };

        DataService.getOne('employee', {where: {user: $scope.user.id}})
          .then(function(res){
            $scope.employee = res;
            $scope.fetchData();
          });

        // Function to change sort column / direction on list
        $scope.changeSort = function(item) {
          var sort = $scope.sort;

          if (sort.column === item.column) {
            sort.direction = !sort.direction;
          } else {
            sort.column = item.column;
            sort.direction = true;
          }

          if ($scope.currentPage === 1) {
            $scope.fetchData();
          } else {
            $scope.currentPage = 1;
          }
        };

        // Scope function to fetch data count and actual data
        $scope.fetchData = function() {
          $scope.loading = true;

          // Data query specified parameters
          console.log($scope.employee.id);
          var parameters = {
            where: { employee: $scope.employee.id },
            limit: $scope.itemsPerPage,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
          };

          // Fetch data count
          DataService
            .count($scope.endPoint, { employee: $scope.employee.id })
            .success(function(response) {
              $scope.itemCount = response.count;
            });

          // Fetch actual data
          DataService
            .get($scope.endPoint, parameters)
            .success(function(response) {
              $scope.items = response;
              $scope.items.forEach(function(data) {
                data.total = 0;

                data.items.forEach(function(item) {
                  data.total += item.value;
                });

              });

              $scope.loaded = true;
              $scope.loading = false;
            });
        };

        $scope.$watch('currentPage', function() {
          $scope.fetchData();
        });

        // Help function for this controller
        $scope.showHelp = function() {
          $modal.open({
            templateUrl: '/frontend/info/help.html',
            controller: 'InfoController',
            size: 'lg',
            resolve: {
              title: function() {
                return 'Information about "Expenses" GUI';
              },
              section: function() {
                return 'backyard/adm/expenses';
              }
            }
          });
        };
      }
    ]
  );
}());
