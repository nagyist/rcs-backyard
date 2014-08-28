/**
 * Frontend application definition.
 *
 * This is the main file for the 'Frontend' application.
 *
 * @todo should these be done in separated files?
 */
(function() {
  'use strict';

  // Create frontend module and specify dependencies for that
  angular.module('frontend', [
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'angularMoment',
    'linkify',
    'frontend-templates',
    'sails.io',
    'frontend.components',
    'frontend.controllers',
    'frontend.directives',
    'frontend.filters',
    'frontend.interceptors',
    'frontend.services',
    'frontend.example',
    'frontend.backyard'
  ]);

  // Initialize used frontend specified modules
  angular.module('frontend.components', []);
  angular.module('frontend.controllers', []);
  angular.module('frontend.directives', []);
  angular.module('frontend.filters', []);
  angular.module('frontend.interceptors', []);
  angular.module('frontend.services', []);
  angular.module('frontend.example', [
    'frontend.example.book',
    'frontend.example.books',
    'frontend.example.authors',
    'frontend.example.messages',
    'frontend.example.chat'
  ]);
  angular.module('frontend.backyard', [
    'frontend.backyard.tools',
    'frontend.backyard.adm.expenses',
    'frontend.backyard.adm.employees'
  ]);

  /**
   * Configuration for frontend application, this contains following main sections:
   *
   *  1) Configure $httpProvider and $sailsSocketProvider
   *  2) Set necessary HTTP and Socket interceptor(s)
   *  3) Turn on HTML5 mode on application routes
   *  4) Set up application routes
   */
  angular.module('frontend')
    .config(
    [
      '$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$sailsSocketProvider',
      'AccessLevels',
      function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $sailsSocketProvider,
               AccessLevels
        ) {
        $httpProvider.defaults.useXDomain = true;

        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Add interceptors for $httpProvider and $sailsSocketProvider
        $httpProvider.interceptors.push('AuthInterceptor');
        $httpProvider.interceptors.push('ErrorInterceptor');
        $sailsSocketProvider.interceptors.push('AuthInterceptor');
        $sailsSocketProvider.interceptors.push('ErrorInterceptor');

        // Yeah we wanna to use HTML5 urls!
        $locationProvider
          .html5Mode(true)
          .hashPrefix('!')
        ;

        // Routes that are accessible by anyone
        $stateProvider
          .state('anon', {
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.anon
            }
          })
          .state('anon.intro', {
            url: '/intro',
            templateUrl: '/frontend/system/intro.html'
          })
          .state('anon.login', {
            url: '/login',
            templateUrl: '/frontend/system/login/login.html',
            controller: 'LoginController'
          })
          .state('anon.about', {
            url: '/about',
            templateUrl: '/frontend/example/about/about.html'
          })
        ;

        // Routes that needs authenticated user
        $stateProvider
          .state('example', {
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.user
            }
          })
          .state('example.books', {
            url: '/books',
            templateUrl: '/frontend/example/books/books.html',
            controller: 'BooksController'
          })
          .state('example.book', {
            url: '/book/:bookTitle',
            templateUrl: '/frontend/example/book/book.html',
            controller: 'BookController',
            resolve: {
              book: [
                '$stateParams','DataService',
                function($stateParams, DataService) {
                  return DataService.getOne('book', {title: $stateParams.bookTitle});
                }
              ]
            }
          })
          .state('example.authors', {
            url: '/authors',
            templateUrl: '/frontend/example/authors/authors.html',
            controller: 'AuthorsController'
          })
          .state('example.messages', {
            url: '/messages',
            templateUrl: '/frontend/example/messages/messages.html',
            controller: 'MessagesController'
          })
          .state('example.chat', {
            url: '/chat',
            templateUrl: '/frontend/example/chat/chat.html',
            controller: 'ChatController'
          })
          ;

        $stateProvider
          .state('backyard', {
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.user
            }
          })
          .state('backyard.tools', {
            url: '/tools',
            templateUrl: '/frontend/backyard/tools/tools.html',
            controller: 'ToolsController'
          })
          .state('backyard.adm', {
            url: '/adm',
            templateUrl: '/frontend/backyard/adm/menu.html'
          })
          .state('backyard.adm.employees', {
            url: '/employees',
            templateUrl: '/frontend/backyard/adm/employees/employees.html',
            controller: 'EmployeesController'
          })
          .state('backyard.adm.employee', {
            url: '/employee/:id',
            templateUrl: '/frontend/backyard/adm/employees/employee.html',
            controller: 'EmployeeController'
          })
          .state('backyard.adm.expenses', {
            url: '/expenses',
            templateUrl: '/frontend/backyard/adm/expenses/expenses.html',
            controller: 'ExpensesController'
          })
          .state('backyard.adm.expenseAdd', {
            url: '/expense/add',
            templateUrl: '/frontend/backyard/adm/expenses/expense-form.html',
            controller: 'ExpenseController'
          })
          .state('backyard.adm.expense', {
            url: '/expenses/:id',
            templateUrl: '/frontend/backyard/adm/expenses/expense.html',
            controller: 'ExpenseViewController'
          })
          .state('backyard.adm.documents', {
            url:'/documents',
            template: 'TO-DO: Modelos documentais'
          })
        ;

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/intro');
      }
    ]
  );

  /**
   * Frontend application run hook configuration. This will attach auth status
   * check whenever application changes URL states.
   */
  angular.module('frontend')
    .run([
      '$rootScope', '$state', 'Auth',
      function($rootScope, $state, Auth) {
        // And when ever route changes we must check authenticate status
        $rootScope.$on('$stateChangeStart', function(event, toState) {
          if (!Auth.authorize(toState.data.access)) {
            event.preventDefault();

            $state.go('anon.login');
          }
        });
      }
    ]);
}());
