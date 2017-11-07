var app = angular.module('tnChatbot', ['ui.bootstrap','ui.router']);

app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('bot', {
        url: '/bot',
        templateUrl: 'apps/bot.html',
        controller: 'botCtrl as botCtrl'
    });
    $urlRouterProvider.otherwise('/bot');
}]);