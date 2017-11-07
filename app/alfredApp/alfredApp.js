'use strict';

angular.module('TN_App.alfredApp', ['ui.router'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('alfredApp', {
            url: '/alfredApp',
            templateUrl: 'alfredApp/alfredApp.html',
            controller: 'alfredAppCtrl as vm'
        });
    }])

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
                    '<p>' + vm.displayString + '</p><br>';
                                             
                    for(var i=0;i<vm.list.length;i++){
                        control =control + '<p>' + vm.list[i] + '</p>' ;
                    }

                    control=control+
                    '<p><small>' + date + '</small></p>'+                    
                    '</div>' +
                    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                    '</li>';
                    
                }else if(text.type=='text'){
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
                        '<p>' + vm.displayString + '</p><br>' +
                        '<p> Comapany Name: ' + text.data.multipleFields.company + '</p>' +
                        '<p> Overview: ' + text.data.multipleFields.overview + '</p>' +
                        '<p> year: ' + text.data.multipleFields.year + '</p>' +
                        '<p> website: <a href="'+text.data.multipleFields.website+'">' + text.data.multipleFields.website + '</p></a>' +
                        '<p><small>' + date + '</small></p>' +
                        '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                        '</li>';
                }
            }
          

            $("ul").append(control);

            // setTimeout(
            //     function() {
            //         $("ul").append(control);

            //     }, time);

        }

        vm.resetChat = function() {
            $("ul").empty();
        }

        $(".mytext").on("keyup", function(e) {
            if (e.which == 13) {
                var text = $(this).val();
                if (text !== "") {

                    //call apiservice
                    vm.askApi(text);

                    vm.insertChat("me", text);
                    $(this).val('');
                }
            }
        });

        //-- Clear Chat
        vm.resetChat();

        //-- Print Messages
        /*vm.welcome={
            "type":"text",
            "data":{
                "text":"Welcome...!"
            }
        };
        vm.insertChat("you",vm.welcome, 0);*/

        vm.askApi=function(query){
            var client = new ApiAi.ApiAiClient({accessToken: "66f53a3b0e5f45a0b6f6efbafb0f6a46"});
     
            client.textRequest(query)//"tell me more"//"Give me overview of Aegify")//"Companies in Mumbai")
              .then(function(response) {
               var result,displayText;
               try {
                 result = response.result.fulfillment.speech;
                 displayText=response.result.fulfillment.displayText;

                 /*displayText={                                
                               "type": "multipleVariables",
                               "displayString": "The company Aegify deals with Cloud based security, risk and compliance assurance solution. The company was established in 2007 and is based out of Bangalore. You can vist their website on aegify.com ",
                               "data": {
                                    "multipleFields":{
                                        "company":"Aegify",
                                        "overview":"Cloud base security risk and compliance assurance solution",
                                        "year":"2007",
                                        "website":"http://www.aegify.com"
                                    },
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
                                       "Airpix"
                                   ]
                               }
                            };*/
                 
                 vm.insertChat("you", displayText, 0);
               } catch(error) {
                 result = "";
               }
             })
        }
    }]);
