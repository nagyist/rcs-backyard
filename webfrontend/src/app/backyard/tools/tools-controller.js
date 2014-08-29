/**
 * Just an example controller to list all books.
 */
(function() {
    'use strict';

    angular.module('frontend.backyard.tools')
        .controller('ToolsController',
            [
                '$scope', '$modal', 'CurrentUser',
                function($scope, $modal, CurrentUser) {
                    // Initialize data
                    $scope.user = CurrentUser.user();

                    // Help function for this controller
                    $scope.showHelp = function() {
                        $modal.open({
                            templateUrl: '/frontend/info/help.html',
                            controller: 'InfoController',
                            size: 'lg',
                            resolve: {
                                title: function() {
                                    return 'Information about "Tools page"';
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
