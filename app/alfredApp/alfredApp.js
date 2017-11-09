'use strict';

angular.module('TN_App.alfredApp', ['ui.router'])

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
        $stateProvider.state('fintech', {
            url: '/fintech',
            templateUrl: 'alfredApp/alfredApp.html',
            controller: 'alfredAppCtrl as vm'
        })
        .state('insurance', {
            url: '/insurance',
            templateUrl: 'alfredApp/insurance.html',
            controller: 'alfredAppCtrl as vm'
        })
        .state('banking', {
            url: '/banking',
            templateUrl: 'alfredApp/banking.html',
            controller: 'alfredAppCtrl as vm'
        })
        .state('alfredApp', {
            url: '/alfredApp',
            templateUrl: 'alfredApp/landing-screen.html',
            controller: 'landingScreenCtrl as vm'
        });
        //$urlRouterProvider.otherwise('/landing-screen');
    }])

    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
  
  

    .controller('alfredAppCtrl', ['$scope', '$compile', function($scope,$compile) {
        var vm = this;

        vm.me = {
            avatar: "https://randomuser.me/api/portraits/med/men/83.jpg"
        };

        vm.you = {
            avatar: "https://az705183.vo.msecnd.net/dam/skype/media/concierge-assets/avatar/avatarcnsrg-800.png"
        };

        /*All the configuration goes here*/
        vm.config = {
            //"baseUrl": "http://ec2-13-126-130-219.ap-south-1.compute.amazonaws.com:8080/alfresco/service/api/",
            
        }
        
        $scope.myDataSource = {
          chart: {
        caption: "Age profile of website visitors",
        subcaption: "Last Year",
        startingangle: "120",
        showlabels: "0",
        showlegend: "1",
        enablemultislicing: "0",
        slicingdistance: "15",
        showpercentvalues: "1",
        showpercentintooltip: "0",
        plottooltext: "Age group : $label Total visit : $datavalue",
        theme: "fint"
        },
    data: [
        {
            label: "Teenage",
            value: "1250400"
        },
        {
            label: "Adult",
            value: "1463300"
        },
        {
            label: "Mid-age",
            value: "1050700"
        },
        {
            label: "Senior",
            value: "491000"
        }
    ]
}

        /*Config ends here*/        


        /*isEmptyVal: check empty val for string, array, object*/
        vm.isEmptyVal = function(val) {
            if (val === undefined) {
                return true;
            }
            if (val === null) {
                return true;
            }
            if (val instanceof Object) {
                return Object.keys(val).length === 0;
            }

            if (val instanceof Array) {
                return val.length === 0;
            }

            if (val.toString().trim().length === 0) {
                return true;
            }
            return false;
        }

        /*Ends here*/

        //TODO: Do we need this?
        vm.notification = [];
        vm.postData = {};



        //TODO: Do we need this ?
        vm.updateEvent = function(msg) {
            vm.postData.text = msg;
        }


        vm.formatAMPM = function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        vm.insertChat = function(who, text, time = 0) {
            var control = "";
            var date = vm.formatAMPM(new Date());

            

            if (who == "me") {
                if (text.includes("history") || text.includes("version")){
                  vm.getVersionHistory();
                }
                control = '<li style="width:100%;padding-left: 10px;">' +
                    '<div class="msj macro">' +
                    '<div class="avatar"><img class="img-circle" style="width:50%;" src="' + vm.me.avatar + '" /></div>' +
                    '<div class="text text-l">' +
                    '<p>' + text + '</p>' +
                    '<p><small>' + date + '</small></p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            } else {

                text=JSON.parse(text);
                vm.displayString=text.displayString;
                if(text.type=='listOfCompany'){
                    
                    vm.list=text.data.list;

                    control = '<li style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<h5>' + vm.displayString + '</h5><p class="api-res-data">';
                    
                    for(var i=0;i<vm.list.length;i++){
                        control =control  + vm.list[i]  + '<br><br>';
                    }
                    control=control+
                    '</p><p><small>' + date + '</small></p>'+                    
                    '</div>' +
                    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                    '</li>';
                    
                }else if(text.type=='Description'){
                    control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<p>' + text.data.text + '</p>' +
                        '<p><small>' + date + '</small></p>' +
                        '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                        '</li>';
                }else if(text.type=='link'){
                    control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<p>' + vm.displayString + '</p>' +
                        '<p><a href="'+text.data.link+'">' + text.data.link + '</p></a>' +
                        '<p><small>' + date + '</small></p>' +
                        '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                        '</li>';
                }else if(text.type=='multipleVariables'){
                    control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<p>' + vm.displayString + '</p><br>'+
                        '<div class="api-res-data">' +
                        '<p> Comapany Name: ' + text.data.multipleFields.company + '</p>' +
                        '<p> Overview: ' + text.data.multipleFields.overview + '</p>' +
                        '<p> year: ' + text.data.multipleFields.year + '</p>' +
                        '<p> website: <a href="'+text.data.multipleFields.website+'">' + text.data.multipleFields.website + '</a></p>' +
                        '</div>'+
                        '<p><small>' + date + '</small></p>' +
                        '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                        '</li>';
                }else if(text.type=="image"){    
                    //vm.encodedImg = arrayBufferToBase64(displayText.data.image);         
                    control = '<li style="width:100%;">' +
                            '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                            '<p>' + vm.displayString + '</p>' +
                            '<p><img class="img-logo-size" src="alfredApp/images/img_logo.png" ng-click="vm.showImage( '+ text.data.image  + ')"/><p>'+                            
                            '<img ng-show="' + vm.showImg + '" class="img-preview-size" ng-src="data:image/*;base64,{{'+ vm.encodedImg +'}}"/>'+
                            '<p><small>' + date + '</small></p>' +
                            '</div>' +
                            '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                            '</li>';        
                                         
                }/*else if(text.type=="pdf"){
                    var file = new Blob([displayText.data.pdf], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    win.location = fileURL;
                }*/

                
                else if(text.type=='graph'){
                     control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<fusioncharts width="600" height="400" type="pie3d" datasource="' + $scope.myDataSource + '"></fusioncharts>' +
                        '<p><small>' + date + '</small></p>' +
                        '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                        '</li>';
//                    control = '<p ng-bind-html="vm.htmlString"></p>'; 
                      
                      
                      
                      
                }
            }
          

            $("ul").append(control);

            // setTimeout(
            //     function() {
            //         $("ul").append(control);

            //     }, time);

        }

        vm.showImage=function(){
            vm.showImg=true;
            vm.img = arrayBufferToBase64(displayText.data.image); 
        }

        vm.resetChat = function() {
            $("ul").empty();
        }

//        $(".mytext").on("keyup", function(e) {
        vm.sendUserQuery = function(){
            //if (e.which == 13) {
                var text = vm.userText;
                if (text !== "") {
                    //call apiservice
                    vm.askApi(text);
                    vm.insertChat("me", text);
                    vm.userText = "";
                }
            //}
        };

        //-- Clear Chat
        vm.resetChat();

        //-- Print Messages
        vm.welcome={
            "type":"Description",
            "data":{
                "text":"Welcome...!"
            }
        };
        vm.insertChat("you",JSON.stringify(vm.welcome), 0);

        vm.askApi=function(query){
            var client;
            if(vm.sessionId==''){
                 client= new ApiAi.ApiAiClient(
                    {
                        accessToken: "66f53a3b0e5f45a0b6f6efbafb0f6a46"
                        //sessionId:"83fb2cd8-5a43-5b70-efde-caa70b3a602f"
                    }
                );
             }else{
                client= new ApiAi.ApiAiClient(
                    {
                        accessToken: "66f53a3b0e5f45a0b6f6efbafb0f6a46",
                        sessionId:vm.sessionId
                    }
                );
             }
     
            client.textRequest(query)//"tell me more"//"Give me overview of Aegify")//"Companies in Mumbai")
              .then(function(response) {
               var result,displayText;
               try {
                 result = response.result.fulfillment.speech;
                 //displayText=response.result.fulfillment.displayText;
                 vm.sessionId=response.sessionId;

                 if(response.result.action.indexOf('smalltalk')!==-1){
                    displayText={
                        "displayString": response.result.fulfillment.speech,
                        "data":{
                            "text":response.result.fulfillment.speech
                        },
                        "type":"Description"
                    }
                    displayText=JSON.stringify(displayText);
                 }else{
                    displayText=response.result.fulfillment.displayText;
                 }



  //<<<<<<< HEAD
  //
  //                 displayText={
  //                                   "type": "graph",
  //                                   "displayString": "Showing list of companies in mumbai: ",
  //                                   "data": {
  //                                       "list": [
  //                                           "1 Martian Way",
  //                                           "1MarketView",
  //                                           "ABFL Direct",
  //                                           "Absentia Virtual Reality",
  //                                           "Accsure",
  //                                           "Aerialair",
  //                                           "Airpay",
  //                                           "Airpix"
  //                                       ]
  //                                   }
  //=======

                 /*displayText={                                
                               "type": "image",
                               "displayString": "The company Aegify deals with Cloud based security, risk and compliance assurance solution. The company was established in 2007 and is based out of Bangalore. You can vist their website on aegify.com ",
                               "data": {
                                    "multipleFields":{
                                        "company":"Aegify",
                                        "overview":"Cloud base security risk and compliance assurance solution",
                                        "year":"2007",
                                        "website":"http://www.aegify.com"
                                    },
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
                 
                 vm.insertChat("you", displayText, 0);
               } catch(error) {
                 result = "";
               }
             })
        }
    }])


.controller('landingScreenCtrl', ['$scope','$state', function($scope,$state) {
        var vm = this;

        $scope.goToBot=function(botName){
            if(botName=='fintech'){
                $state.transitionTo('fintech');
            }else if(botName=='insurance'){
                $state.transitionTo('insurance');
            }else if(botName=='banking'){
                $state.transitionTo('banking');
            }
        }

    }]);
