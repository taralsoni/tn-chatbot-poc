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
            templateUrl: 'alfredApp/alfredApp.html',
            controller: 'alfredAppCtrl as vm'
        })
        .state('banking', {
            url: '/banking',
            templateUrl: 'alfredApp/alfredApp.html',
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

    .directive('compile', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
   )};
  }])

  
  .service('chatService', function(){
       var control,botType;
       return{
            getHtmlForList:function(displayString,list){
                
                  control=displayString + '<br><br>'+
                  '<div class="div-border-left">';
                  for(var i=0;i<list.length;i++){
                        control =control + '<strong>' + list[i]  + '</strong><br>';
                    }
                    control=control+'</div>';
                return control;    
            },
            getHtmlForDesc:function(description){
                        control=description;
                        return control;
            },
            getHtmlForJson:function(displayString,dataJsonArray){
                control =  displayString +
                            '<br><br><div class="div-border-left">';

                        for(var i=0;i<dataJsonArray.length;i++){
                            dataJsonArray[i].key= (!!dataJsonArray[i].key) ? dataJsonArray[i].key.charAt(0).toUpperCase() + dataJsonArray[i].key.substr(1).toLowerCase() : '';
                            if(dataJsonArray[i].type=='description'){
                                control=control+'<p> <strong>'+ dataJsonArray[i].key +': </strong>'  + dataJsonArray[i].value + '</p>' ;
                            }else if(dataJsonArray[i].type=='link'){
                                control=control+'<p>  <strong>' + dataJsonArray[i].key + ': </strong><a href="'+ dataJsonArray[i].value +'">' + dataJsonArray[i].value + '</a></p>';
                            }else if(dataJsonArray[i].type=='pdf'){
                                control=control+'<p>  <strong>' + dataJsonArray[i].key + ': </strong><a href="'+ dataJsonArray[i].value +'">' + dataJsonArray[i].value + '</a></p>';
                            }
                        }
                        control=control+'</div>';
                return control;
            },
            getHtmlForGraph:function(displayString,graphJson,chartId,containerId){
                control= /*displayString +*/ '<br>'+
                            '<div id="'+ containerId +'"></div>';
                 
                        FusionCharts.ready(function() {
               
                        var revenueChart = new FusionCharts({
                            id: chartId,//'revenue-chart',
                            type: 'column2d',
                            renderAt: containerId,//'chart-container',
                            dataFormat: 'json',
                            dataSource: {
                                  // Chart data goes here
                                    chart: {
                                        caption: displayString,
                                        subcaption: "",
                                        startingangle: "120",
                                        showlabels: "0",
                                        showlegend: "1",
                                        enablemultislicing: "0",
                                        slicingdistance: "15",
                                        showpercentvalues: "1",
                                        showpercentintooltip: "0",
                                        plottooltext: "$label : $datavalue", //"Age group : $label Total visit : $datavalue",
                                        theme: "fint"
                                    },

                                    data: graphJson/*[
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
                                    ]*/
                                }
                            });
                     
                        revenueChart.render();
                        //revenueChart = FusionCharts(chartId);
                        revenueChart = FusionCharts('revenue-chart');
                    });
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
            },
            setBotType:function(botName){
                botType=botName;
            },
            getBotType:function(){
                return botType;
            },
            getHtmlForButtons:function(jsonData){
                control = jsonData.openingText + '<br> <br>' + '<div class="row">';
                for(var i=0;i<jsonData.buttonNames.length;i++){
                    control = control + '<div class="col-xs-6 col-sm-6 col-md-2"> <button type="submit" class="btn btn-block btn-success" ng-click="' + jsonData.callBackFn + '()" style="margin-left: 20px;margin-right: 20px;">' + jsonData.buttonNames[i] + '</button>' + '</div>';
                }
                control = control + '</row>';
                return control;
            }
       } 
    })


  

    .controller('alfredAppCtrl', ['$scope', '$compile','chatService','$sce','$http', function($scope,$compile,chatService,$sce,http) {
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
        
        vm.buttonCallBackFunction = function(){
            console.log("Button was cliecked");
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
            vm.chartIndex=0;
            vm.botType=chatService.getBotType();
            vm.accessToken='66f53a3b0e5f45a0b6f6efbafb0f6a46';//default fintech


            if(vm.botType=='insurance'){
                vm.accessToken='3bb6c6b79135440184319e7c6db96ecd';
            }else if(vm.botType=='fintech'){
                vm.accessToken='66f53a3b0e5f45a0b6f6efbafb0f6a46';
            }

                                          
            vm.client= new ApiAi.ApiAiClient(
            {
                    accessToken: vm.accessToken
                }
            );
             

            var history = {};
            if(vm.botType=='insurance'){
                history.user = 'Rosey@Insurance';
            }else if(vm.botType=='fintech'){
                history.user = 'Rosey@Fintech';
            }

            history.image = "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg";
            history.text =  'Hi Rosey here. How can I help you!';
            history.ts =  vm.formatAMPM(new Date());
            vm.conversationHistory.push(history);

             
        }

        


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
                control =  text;
            }
            else{


                history.user = 'Rosey@Fintech';
                history.image = "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg";


                text=JSON.parse(text);
                vm.displayString=text.displayString;

               
                if(text.type=='list'){
                  vm.list=text.data.list;
                  control=chatService.getHtmlForList(vm.displayString,vm.list);
                    
                }else if(text.type=='description'){
                    control=chatService.getHtmlForDesc(text.data.text);
                    
                }else if(text.type=='link'){
                    
                    control=chatService.getHtmlForLink(vm.displayString,text.data.link);
                }else if(text.type=='longDescription'){
                
                        control=chatService.getHtmlForJson(vm.displayString,text.data.multipleFields);
                }else if(text.type=="image"){    
                    //vm.encodedImg = arrayBufferToBase64(displayText.data.image);                           
                    control=chatService.getHtmlForImage(vm.displayString,text.data.image);       
                                         
                }else if(text.type=="pdf"){
                    /*var file = new Blob([displayText.data.pdf], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    win.location = fileURL;*/   
                    //$http.get(text.data.pdfLink);

                }
                else if(text.type=='graph'){ 
                    vm.containerId='chart-container-' + vm.chartIndex;
                    vm.chartId='revenue-chart-' + vm.chartIndex;
                    control=chatService.getHtmlForGraph(vm.displayString,text.data.multipleFields,vm.containerId,vm.chartId);
                    vm.chartIndex++;
                }
                else if(text.type=='buttons'){
                    var jsonData = {
                        'openingText' : 'Hey, Showing you monthly results',
                        'buttonNames' : ['button1','button2','button3','button4','button5'],
                        'callBackFn' : 'vm.buttonCallBackFunction'     
                    }
                    control = chatService.getHtmlForButtons(jsonData);
                }
                
            }
            history.text = $sce.trustAsHtml(control);
            history.ts = vm.formatAMPM(new Date());
            //vm.conversationHistory.push(history);

        
            if ($scope.$$phase) { // most of the time it is "$digest"
                applyFn(history);
            } else {
                $scope.$apply(applyFn(history));
            }
              

        }

        var applyFn = function (history) {
            vm.conversationHistory.push(history);
        };

        vm.showImage=function(){
            vm.showImg=true;
            vm.img = arrayBufferToBase64(displayText.data.image); 
        }

        vm.resetChat = function() {
            $("ul").empty();
        }

        vm.sendUserQuery = function(){
                var text = vm.userText;
                if (text !== "") {
                    //call apiservice
                    vm.askApi(text);
                    vm.insertChat("me", text);
                    vm.userText = "";
                }            
        };

        //-- Clear Chat
        vm.resetChat();

        //-- Print Messages
        vm.welcome={
            "type":"description",
            "data":{
                "text":"Welcome...!"
            }
        };

        vm.askApi=function(query){
     
            vm.client.textRequest(query)
              .then(function(response) {
               var speech,displayText;
               try {
                 speech = response.result.fulfillment.speech;
                 vm.sessionId=response.sessionId;

                 if(!response.result.fulfillment.hasOwnProperty('displayText') && speech=="") {
                    displayText={
                            "displayString": 'Sorry',
                            "data":{
                                "text":'Sorry! We could not find anything. Can you try with a different query please...'
                            },
                            "type":"description"
                        }
                        displayText=JSON.stringify(displayText);
                 }else{

                        if(!response.result.fulfillment.hasOwnProperty('displayText') && speech!=""){
                            displayText={
                                "displayString": response.result.fulfillment.speech,
                                "data":{
                                    "text":response.result.fulfillment.speech
                                },
                                "type":"description"
                            }
                            displayText=JSON.stringify(displayText);
                        }
                        else{
                            //when displaytext is present
                            displayText=response.result.fulfillment.displayText;
                        }                     
                }   
                //stubbed graph type
                /*displayText={                                
                   "type": "pdf",
                   "displayString": "Age profile of website visitors last year",
                   "data": {
                        "graph":"",
                        "pdfLink":"https://www.tutorialspoint.com/operating_system/operating_system_tutorial.pdf"
                    }
                };
                displayText=JSON.stringify(displayText); */                       
                vm.insertChat("you", displayText, 0);

               } catch(error) {
                  speech = "";
               }
             })
        }
         vm.init();
    }])


.controller('landingScreenCtrl', ['$scope','$state','chatService', function($scope,$state,chatService) {
        var vm = this;

        $scope.goToBot=function(botName){
            
            chatService.setBotType(botName);
            if(botName=='fintech'){
                $state.transitionTo('fintech');
            }else if(botName=='insurance'){
                $state.transitionTo('insurance');
            }else if(botName=='banking'){
                $state.transitionTo('banking');
            }
        }
}]);
