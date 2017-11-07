'use strict';

// Declare app level module which depends on views, and components
angular.module('TN_App', [
  // 'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'ui.select',
  'TN_App.chatbot',
  'TN_App.alfredApp',
  'angularFileUpload',
  'TN_App.version'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/alfredApp');
}]);
