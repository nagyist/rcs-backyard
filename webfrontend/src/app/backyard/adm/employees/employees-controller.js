/**
 * Just an example controller to list all books.
 */
(function() {
    'use strict';

    angular.module('frontend.backyard.adm.employees')
        .controller('EmployeesController',
            [
                '$scope', '$modal', 'DataService',
                function($scope, $modal, DataService) {
                    // Initialize data
                    $scope.endPoint = 'employee';
                    $scope.itemCount = 0;
                    $scope.items = [];
                    $scope.itemsPerPage = 10;
                    $scope.currentPage = 1;
                    $scope.activeTab = 'backyard.adm.employees';
                    $scope.loading = true;
                    $scope.loaded = false;

                    // Initialize used title items
                    $scope.titleItems = [
                        {title: 'Username', column: false},
                        {title: 'Name', column: 'name'},
                        {title: 'Region', column: false},
                        {title: 'Position', column: false},
                        {title: 'Admission Date', column: 'admissionDate'},
                        {title: 'Actions', column: false,
                            'class': 'text-right'}
                    ];

                    // Initialize default sort data
                    $scope.sort = {
                        column: 'name',
                        direction: true
                    };

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
                        var parameters = {
                            limit: $scope.itemsPerPage,
                            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
                            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
                        };

                        // Fetch data count
                        DataService
                            .count($scope.endPoint)
                            .success(function(response) {
                                $scope.itemCount = response.count;
                            });

                        // Fetch actual data
                        DataService
                            .get($scope.endPoint, parameters)
                            .success(function(response) {
                                $scope.items = response;

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
                                    return 'Information about "Employees" GUI';
                                },
                                section: function() {
                                    return 'backyard/adm/employees';
                                }
                            }
                        });
                    };
                }
            ]
        );
}());
