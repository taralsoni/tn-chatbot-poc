'use strict';

var app = angular.module('TN_App.alfredApp', ['ui.router','ngSanitize'])

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
        $stateProvider.state('fintech', {
            url: '/fintech',
            templateUrl: 'alfredApp/insurance.html',
            controller: 'insuranceCtrl as vm'
        })
        .state('insurance', {
            url: '/insurance',
            templateUrl: 'alfredApp/insurance.html',
            controller: 'insuranceCtrl as vm'
        }).state('banking', {
            url: '/banking',
            templateUrl: 'alfredApp/banking.html',
            controller: 'bankingCtrl as banking'
        })
        .state('landing-screen', {
            url: '/landing-screen',
            templateUrl: 'alfredApp/landing-screen.html',
            controller: 'landingScreenCtrl as vm'
        })
        .state('chatbotApp', {
            url: '/chatbotApp',
            templateUrl: 'alfredApp/chat-popup.html',
            controller: 'chatPopupCtrl as vm'
        });
        //$urlRouterProvider.otherwise('/chat-popup');
    }]);