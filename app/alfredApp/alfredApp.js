'use strict';

angular.module('TN_App.alfredApp', ['ui.router','ngSanitize'])

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
  
  .service('chatService', function(){
       var control;
       return{
            getHtmlForList:function(displayString,list){
                control = '<div style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<h5>' + displayString + '</h5><p class="api-res-data">';
                    
                    for(var i=0;i<list.length;i++){
                        control =control  + list[i]  + '<br><br>';
                    }
                    control=control+
                    '</p>'+                    
                    '</div>'  +
                    '</div></div>';
                return control;    
            },
            getHtmlForDesc:function(description){
                    control = '<div style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<p>' + description + '</p>' +
                        '</div>'  +
                        '</div>';
                        return control;
            },
            
            getHtmlForJson:function(displayString,dataJsonArray){
                control = '<div style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<p>' + displayString + '</p><br>'+
                        '<div class="api-res-data">' ;
                        for(var i=0;i<dataJsonArray.length;i++){
                                                    
                            if(dataJsonArray[i].type=='Description'){
                                control=control+'<p>'+ dataJsonArray[i].key +':'  + dataJsonArray[i].value + '</p>' ;
                            }else if(dataJsonArray[i].type=='link'){
                                control=control+'<p>' + dataJsonArray[i].key + ':<a href="'+ dataJsonArray[i].value +'">' + dataJsonArray[i].value + '</a></p>';
                            }
                        }

                        /*control=control+
                        '<p> Comapany Name: ' + dataJson.company + '</p>' +
                        '<p> Overview: ' + dataJson.overview + '</p>' +
                        '<p> year: ' + dataJson.year + '</p>' +
                        '<p> website: <a href="'+dataJson.website+'">' + dataJson.website + '</a></p>' +
                        */
                        control=control+'</div>'+
                        '</div>'  +
                        '</div></div>';
                return control;
            },
            getHtmlForGraph:function(myDataSource){
                 control = '<div style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<fusioncharts width="600" height="400" type="pie3d" datasource="' + smyDataSource + '"></fusioncharts>' +
                        '</div>'  +
                        '</div>';
                return control;
            },
            getHtmlForLink:function(displayString,link){
                control = '<div style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<p>' + displayString + '</p>' +
                        '<p><a href="'+link+'">' + link + '</p></a>' +
                        '</div>'  +
                        '</div>';
                return control;
            },
            getHtmlForImage:function(displayString,image){
                 control = '<div style="width:100%;">' +
                            '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                            '<p>' + displayString + '</p>' +
                            '<p><img class="img-logo-size" src="alfredApp/images/img_logo.png" ng-click="vm.showImage( '+ image  + ')"/><p>'+                            
                            /*'<img ng-show="' + vm.showImg + '" class="img-preview-size" ng-src="data:image/*;base64,{{'+ vm.encodedImg +'}}"/>'+*/
                            '</div>'  +
                            '</div>';  
                return control;
            }, 
            getHtmlForPdf:function(displayString,list){
                return;
            },
            getHtmlForMap:function(displayString,list){
                return;
            }
       } 
    })
  

    .controller('alfredAppCtrl', ['$scope', '$compile','chatService', function($scope,$compile,chatService) {
        var vm = this;
        
        
        vm.conversationHistory = [];
  
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
        
        
        vm.init = function(){
            var history = {};
            history.user = 'Rosey@Fintech';
            history.image = "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg";
            history.text =  'Hi Rosey here. How can I help you!';
            history.ts =  vm.formatAMPM(new Date());
            vm.conversationHistory.push(history);
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


        

        vm.insertChat = function(who, text, time = 0) {
            var control = "";
            var date = vm.formatAMPM(new Date());
          
            var history = {};
            if (who == "me"){
                history.user = 'Sheldon Fernandes';
                history.image = vm.me.avatar;
                control = '<div class="text text-l">' + '<p>' + text + '</p>' + '</div>';
            }
            else{
                history.user = 'Rosey@Fintech';
                history.image = "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg";
                history.text =  '<div class="text text-l">' + '<p>' + 'This is a text' + '</p>' + '</div>';
                        
            
            
               /*
              if (text.type == "list"){
                  history.text = chatService.getHtmlForList(startText, list, endText);
                 
              }
              
              chatService.getHtmlForList = function(){
                  var html = 
              
              
              }
               
               
               */

                text=JSON.parse(text);
                vm.displayString=text.displayString;
                if(text.type=='listOfCompany'){
                    
                    vm.list=text.data.list;

                    /*control = '<div style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<h5>' + vm.displayString + '</h5><p class="api-res-data">';
                    
                    for(var i=0;i<vm.list.length;i++){
                        control =control  + vm.list[i]  + '<br><br>';
                    }
                    control=control+                    
                    '</div>'  +
                    '</div>';*/

                    control=chatService.getHtmlForList(vm.displayString,vm.list);
                    
                }else if(text.type=='Description'){

                    control=chatService.getHtmlForDesc(text.data.text);
                    
                }else if(text.type=='link'){
                    
                    control=chatService.getHtmlForLink(vm.displayString,text.data.link);
                }else if(text.type=='multipleVariables'){
                    

                        control=chatService.getHtmlForJson(vm.displayString,text.data.multipleFields);
                }else if(text.type=="image"){    
                    //vm.encodedImg = arrayBufferToBase64(displayText.data.image);  
                         
                    control=chatService.getHtmlForImage(vm.displayString,text.data.image);       
                                         
                }/*else if(text.type=="pdf"){
                    var file = new Blob([displayText.data.pdf], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    win.location = fileURL;
                }*/

                
                else if(text.type=='graph'){
                    
//                    control = '<p ng-bind-html="vm.htmlString"></p>'; 
                        chatService.getHtmlForGraph($scope.myDataSource);
                      
                      
                      
                      
                }
                
            }
            history.text = control;
                history.ts = vm.formatAMPM(new Date());
                vm.conversationHistory.push(history);
          

//            $("ul").append(control);

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
//        vm.insertChat("you",JSON.stringify(vm.welcome), 0);

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

                 /*displayText={                                
                               "type": "multipleVariables",
                               "displayString": "The company Aegify deals with Cloud based security, risk and compliance assurance solution. The company was established in 2007 and is based out of Bangalore. You can vist their website on aegify.com ",
                               "data": {
                                    "multipleFields":[
                                        {
                                            "key":"company",
                                            "value":"Aegify",
                                            "type":"Description"
                                        },
                                        {
                                            "key":"overview",
                                            "value":"Cloud base security risk and compliance assurance solution",
                                            "type":"Description"
                                        },
                                        {
                                            "key":"year",
                                            "value":"2007",
                                            "type":"Description"
                                        },
                                        {
                                            "key":"website",
                                            "value":"http://www.aegify.com",
                                            "type":"link"
                                        }
                                        

                                        /*"company":"Aegify",
                                        "overview":"Cloud base security risk and compliance assurance solution",
                                        "year":"2007",
                                        "website":"http://www.aegify.com"*/
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
                 
                 vm.insertChat("you", displayText, 0);
               } catch(error) {
                 result = "";
               }
             })
        }
         vm.init();
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
