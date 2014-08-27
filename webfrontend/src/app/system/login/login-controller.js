/**
 * Login controller to handle user's login to application. Controller uses 'Auth' service
 * to make actual HTTP request to server and try to authenticate user.
 *
 * After successfully login Auth service will store user data and JWT token via 'Storage'
 * service where those are asked whenever needed in application.
 *
 * @todo    Different authentication providers?
 */
(function() {
    'use strict';

    angular.module('frontend.controllers')
        .controller('LoginController',
            [
                '$scope', '$state', 'Auth',
                function($scope, $state, Auth) {
                    // Already authenticated so redirect back to books list
                    if (Auth.isAuthenticated()) {
                        $state.go('tools');
                    }

                    // Initialize credentiasl
                    $scope.credentials = {
                        identifier: '',
                        password: ''
                    };

                    // Scope function to perform actual login request to server
                    $scope.login = function() {
                        Auth
                            .login($scope.credentials)
                            .then(
                                function() {
                                    $state.go('backyard.tools');
                                }
                            );
                    };
                }
            ]
        );
}());
