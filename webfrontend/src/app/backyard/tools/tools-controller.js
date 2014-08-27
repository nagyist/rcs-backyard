/**
 * Just an example controller to list all books.
 */
(function() {
    'use strict';

    angular.module('frontend.backyard.tools')
        .controller('ToolsController',
            [
                '$scope', '$modal',
                function($scope, $modal) {
                    // Initialize data

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
                                    return 'backyard/tools';
                                }
                            }
                        });
                    };
                }
            ]
        );
}());
