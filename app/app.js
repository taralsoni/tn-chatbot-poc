'use strict';

// Declare app level module which depends on views, and components
angular.module('TN_App', [
  // 'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'ui.select',
  'TN_App.alfredApp',
  'angularFileUpload',
  'TN_App.version',
  'ng-fusioncharts'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/chatbotApp');
}]);



                 //stubbed data
                 /*displayText={                                
                               "type": "description",
                               "displayString": "The company Aegify deals with Cloud based security, risk and compliance assurance solution. The company was established in 2007 and is based out of Bangalore. You can vist their website on aegify.com ",
                               "data": {
                                    "multipleFields":[
                                        {
                                            "key":"company",
                                            "value":"Aegify",
                                            "type":"description"
                                        },
                                        {
                                            "key":"overview",
                                            "value":"Cloud base security risk and compliance assurance solution",
                                            "type":"description"
                                        },
                                        {
                                            "key":"year",
                                            "value":"2007",
                                            "type":"description"
                                        },
                                        {
                                            "key":"website",
                                            "value":"http://www.aegify.com",
                                            "type":"link"
                                        }
                                    ],
                                    "image":"",
                                    "text":"Hello world!",
                                    "link":"http://www.google.com",
                                   "list": [
                                       "1 Martian Way",
                                       "1MarketView",
                                       "ABFL Direct",
                                       "Absentia Virtual Reality",
                                       "Accsure",
                                       "Aerialair",
                                       "Airpay",
                                       "Airpix",
                                       "1 Martian Way",
                                       "1MarketView",
                                       "ABFL Direct",
                                       "Absentia Virtual Reality",
                                       "Accsure",
                                       "Aerialair",
                                       "Airpay",
                                       "Airpix",
                                       "1 Martian Way",
                                       "1MarketView",
                                       "ABFL Direct",
                                       "Absentia Virtual Reality",
                                       "Accsure",
                                       "Aerialair",
                                       "Airpay",
                                       "Airpix",
                                       "1 Martian Way",
                                       "1MarketView",
                                       "ABFL Direct",
                                       "Absentia Virtual Reality",
                                       "Accsure",
                                       "Aerialair",
                                       "Airpay",
                                       "Airpix",
                                       "1 Martian Way",
                                       "1MarketView",
                                       "ABFL Direct",
                                       "Absentia Virtual Reality",
                                       "Accsure",
                                       "Aerialair",
                                       "Airpay",
                                       "Airpix",
                                       "1 Martian Way",
                                       "1MarketView",
                                       "ABFL Direct",
                                       "Absentia Virtual Reality",
                                       "Accsure",
                                       "Aerialair",
                                       "Airpay",
                                       "Airpix"
                                   ]
                               }
                            };
                            displayText=JSON.stringify(displayText);*/