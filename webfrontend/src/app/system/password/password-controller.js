/**
 * Change the user password
 */
(function() {
    'use strict';

    angular.module('frontend.controllers')
        .controller('PasswordController', [
            '$scope', '$modal', 'CurrentUser', 'DataService', 'Message', '$state',
            function($scope, $modal, CurrentUser, DataService, Message, $state) {
                // Initialize data
                $scope.user = CurrentUser.user();
                $scope.passwordCurrent = '';
                $scope.passwordNew = '';
                $scope.passwordReType = '';

                $scope.submitPasswordChange = function() {
                    if ($scope.passwordNew !== $scope.passwordReType) {
                        return Message.message('Given passwords doesn\'t match!', {
                            type: 'error'
                        });
                    }

                    DataService.post('user/changePassword', {
                        userId: $scope.user.id,
                        passwordCurrent: $scope.passwordCurrent,
                        passwordNew: $scope.passwordNew,
                        passwordReType: $scope.passwordReType
                    })
                        .success(function(data) {
                            Message.message(data, {
                                type: 'success'
                            });
                            $state.go('backyard.tools');
                        });
                };

                // Help function for this controller
                $scope.showHelp = function() {
                    $modal.open({
                        templateUrl: '/frontend/info/help.html',
                        controller: 'InfoController',
                        size: 'lg',
                        resolve: {
                            title: function() {
                                return 'Information about "Change password page"';
                            },
                            section: function() {
                                return 'backyard/tools';
                            }
                        }
                    });
                };
            }
        ]);
}());
