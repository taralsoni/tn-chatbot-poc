'use strict';

angular.module('TN_App.alfredApp', ['ui.router'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('alfredApp', {
            url: '/alfredApp',
            templateUrl: 'alfredApp/alfredApp.html',
            controller: 'alfredAppCtrl as vm'
        });
    }])

    .controller('alfredAppCtrl', ['$scope', function($scope,) {
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
                vm.displayString=text.displayString;
                if(text.type=='listOfCity'){
                    
                    vm.list=text.data.list;

                    control = '<li style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<p>' + vm.displayString + '</p><br>';
                             
                    for(var i=0;i<vm.list.length;i++){
                        control =control + '<p>' + vm.list[i] + '</p>' ;
                    }
                    control=control+
                    '<p><small>' + date + '</small></p>';
                    '</div>' +
                    '</div>' +
                    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                    '</li>';
                    
                }else if(text.type=='string'){
                    control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<p>' + vm.displayString + '</p>' +
                        '<p><small>' + date + '</small></p>' +
                        '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:50%;" src="' + vm.you.avatar + '" /></div>' +
                        '</li>';
                }
                else if(text.type=='graph'){
                     control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                        '<fusioncharts width="600" height="400" type="pie3d" datasource={{' + $scope.myDataSource + '}}></fusioncharts>' +
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

        vm.resetChat = function() {
            $("ul").empty();
        }

        $(".mytext").on("keyup", function(e) {
            if (e.which == 13) {
                var text = $(this).val();
                if (text !== "") {

                    //call apiservice
                    vm.askApi();

                    vm.insertChat("me", text);
                    $(this).val('');
                }
            }
        });

        //-- Clear Chat
        vm.resetChat();

        //-- Print Messages
        vm.insertChat("you", "Welcome...", 0);

        vm.askApi=function(){
            var client = new ApiAi.ApiAiClient({accessToken: "66f53a3b0e5f45a0b6f6efbafb0f6a46"});
     
            client.textRequest("Companies in Mumbai")
              .then(function(response) {
               var result,displayText;
               try {
                 result = response.result.fulfillment.speech;
                 displayText=response.result.fulfillment.displayText;


                 displayText={
                                   "type": "graph",
                                   "displayString": "Showing list of companies in mumbai: ",
                                   "data": {
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
                               }
                 //displayText="Companies in Mumbai are:"
                 vm.insertChat("you", displayText, 0);
               } catch(error) {
                 result = "";
               }
             })
        }


    }]);
