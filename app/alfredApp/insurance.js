app.controller('insuranceCtrl', ['$scope', '$compile','chatService','$sce','$http','$timeout','$rootScope','Pubnub', function($scope,$compile,chatService,$sce,http,$timeout,$rootScope,Pubnub) {
        var vm = this;
        vm.conversationHistory = [];

        vm.me = {

           // avatar: ""
            avatar: "alfredApp/images/sachin.png"
        };

        vm.you = {
            avatar: "https://az705183.vo.msecnd.net/dam/skype/media/concierge-assets/avatar/avatarcnsrg-800.png"
        };


        /*All the configuration goes here*/
        vm.config = {
            //"baseUrl": "http://ec2-13-126-130-219.ap-south-1.compute.amazonaws.com:8080/alfresco/service/api/",
        }

        /*vm.buttonCallBackFunction = function(){
            console.log("Button was cliecked");
        }*/

        vm.buttonCallBackFunction = function(e){
          var buttonValue = e.target.getAttribute('value');
            console.log("Button was clicked");
            var history = {};
            history.user = 'Sheldon Fernandes';
            history.image = vm.me.avatar;
            history.userType = "me";
            control = buttonValue;
            history.text =  $sce.trustAsHtml(control);
            history.ts = vm.formatAMPM(new Date());
            vm.conversationHistory.push(history);
            vm.askApi(control);
            
          
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
        vm.callIntent = function(text){
            vm.askApi(text);
            vm.insertChat("me", text);
            vm.userText = "";
        }

        
        vm.init = function(){

            vm.isMobile=chatService.getIsMobile();
            console.log('isMobile detected',vm.isMobile);

            vm.typing="...";

            vm.chartIndex=0;
            vm.botType=chatService.getBotType();
            vm.accessToken='66f53a3b0e5f45a0b6f6efbafb0f6a46';//default fintech

            if(vm.botType=='insurance_customer'){
                //vm.accessToken='3bb6c6b79135440184319e7c6db96ecd';
                vm.accessToken='f23810635d23414a952540e54d5d70b6';
            }else if(vm.botType=='fintech'){
                vm.accessToken='66f53a3b0e5f45a0b6f6efbafb0f6a46';
            }else if(vm.botType=='banking_customer'){
                vm.accessToken='69b965b353f24a1ea522bc52c506b548';
            }


            vm.client= new ApiAi.ApiAiClient({
                accessToken: vm.accessToken
            });

            var history = {};
            if(vm.botType=='insurance_customer'){
                history.user = 'Rosey@Insurance';
               // history.text =  'Hi! I am Mike. I can help you with anything related to Insurance ';
                history.text = 'Good Afternoon! Am I speaking with Mr Sachin Goel?';
                //vm.sayIt(history.text);
                //vm.sayIt('Build natural and rich conversational experiences.Give users new ways to interact with your product by building engaging voice and text-based conversational interfaces powered by AI. Connect with users on the Google Assistant, Amazon Alexa, Facebook Messenger, and other popular platforms and devices.Provide us with examples of what a user might say when interacting with your product. Using years of domain knowledge and natural language understanding, we analyze and understand the users intent to help you respond in the most useful way.');
            }else if(vm.botType=='fintech'){
                history.user = 'Rosey@Fintech';
                history.text =  'Hi! I am Mike. I can help you with anything related to Fintech ';
            }else if(vm.botType=='banking_customer'){
                history.user = 'Rosey@CustomerBanking';
                history.text =  'Hi! I am Mike. I can help you with anything related to Customer Banking ';
            }

            history.image = "alfredApp/images/bot.jpg";
             // "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg";
           
            history.ts =  vm.formatAMPM(new Date());
            history.userType = "bot";
            history.addnData="";
            //for map
            history.dataType='';
            history.marker="";

           var options = {
                enableHighAccuracy: true
            };

            // navigator.geolocation.getCurrentPosition(function(pos) {
            //     vm.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            //     //console.log(pos.coords.latitude, pos.coords.longitude);
            // },
            // function(error) {
            //     alert('Unable to get location: ' + error.message);
            // }, options);

            //vm.conversationHistory.push(history);

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
            var addnData = "";
            var date = vm.formatAMPM(new Date());

            var history = {};
            if (who == "me"){
                history.user = 'Sheldon Fernandes';
                history.image = vm.me.avatar;
                control =  text;
                history.userType = "me";
            }
            else{


                history.userType = "bot";
                history.user = 'Rosey@Fintech';
                history.image = "alfredApp/images/bot.jpg";

                if(text==vm.typing){
                    control=chatService.getHtmlForDesc(text);
                }else{

                    text=JSON.parse(text);
                    vm.displayString=text.displayString;


                    //kriti's code- new card1 ui requirement
                    //if no rows found

                    if(text.msgHdr.success=="true"){

                        history.addnData="";

                        //for map
                        history.dataType='';
                        history.marker="";

                        control=chatService.getHtmlForDesc(text.msgBdy.text);
                        vm.sayIt(text.msgBdy.text);

                        /**kriti-if bot asks for location, dont show msg bubble and pass current location*/
                        if(text.msgBdy.text=='Send me your location'){
                            var options = {
                                enableHighAccuracy: true
                            };

                            navigator.geolocation.getCurrentPosition(function(pos) {
                                //vm.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                                console.log(pos.coords.latitude, pos.coords.longitude);
                                vm.currentLatitude=pos.coords.latitude;
                                vm.currentLongitude=pos.coords.longitude;
                                vm.askApi('my lat '+ vm.currentLatitude + ' and long is ' + vm.currentLongitude);
                                //console.log('my lat '+ vm.currentLatitude + ' and long is '+ vm.currentLongitude);
                            },
                            function(error) {
                                alert('Unable to get location: ' + error.message);
                            }, options);
                            control="";

                        }

                        var attachment="";
                        for(var i=0;i<text.msgBdy.attachments.length;i++){
                            attachment=text.msgBdy.attachments[i];
                            if(text.msgBdy.attachments[i].type=='cards'){
                                history.addnData=chatService.getHtmlForScrollCards(text.msgBdy.attachments[i]);
                            }
                            else if(attachment.type=='doubleColumnText'){
                                history.addnData=history.addnData+chatService.getHtmlForDblColCard(attachment);
                            }else if(attachment.type=='itemList'){
                                history.addnData=history.addnData+chatService.getHtmlForKeyValueCard(attachment);
                            }
                            else if(attachment.type=='graph'){
                                history.dataType='graph';
                                var fnData = {
                                    'callBackFn' : 'vm.setIsGraph'
                                }
                                var jsonData = {
                                    'openingText' : '',
                                    'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
                                    'callBackFn' : 'vm.buttonCallBackFunction' 
                                }

                                vm.containerId='chart-container-' + vm.chartIndex;
                                vm.chartId='revenue-chart-' + vm. chartIndex;

                                history.showGraph = true;
                                history.addnData=history.addnData+chatService.getHtmlForGraph3(attachment,vm.containerId,vm.chartId,'history.showGraph');
                                history.addnData=history.addnData+chatService.getHtmlForTable3(attachment,vm.containerId,vm.chartId,'history.showGraph');
                                history.addnData=history.addnData+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
                                history.addnData=history.addnData+chatService.getHtmlForButtons(jsonData);
                            }else if(attachment.type=='map'){

                                history.dataType='map';

                                history.marker=attachment.data;
                            }

                            /** Neha **/
                            /** Checking if attcachment type = text **/
                            else if(text.msgBdy.attachments[i].type=='text'){
                                history.addnData=history.addnData + chatService.getHtmlForText(text.msgBdy.attachments[i]);
                            }

                            else if(text.msgBdy.attachments[i].type=='buttons'){
                                history.addnData=history.addnData + chatService.getHtmlForButtons5(text.msgBdy.attachments[i]);
                            }

                            else if(text.msgBdy.attachments[i].type=='buttons_vertical'){
                               // history.addnData=history.addnData + chatService.getHtmlForButtons(text.msgBdy.attachments[i]);
                               control=chatService.getHtmlForButtons(text.msgBdy.attachments[i]);
                            }
                            /** end **/
                        }
                    }//if msghdr success false
                    else{
                        control=chatService.getHtmlForDesc(text.msgHdr.rsn);
                    }
                } //else end if is not typing   

                
            }
            history.text = $sce.trustAsHtml(control);
            history.addnData = $sce.trustAsHtml(history.addnData);
            history.ts = vm.formatAMPM(new Date());


            if ($scope.$$phase) { // most of the time it is "$digest"
                applyFn(history);
            } else {
                $scope.$apply(applyFn(history));
            }

             $timeout(function() {
              var scroller = document.getElementById("boxBody");
              scroller.scrollTop = scroller.scrollHeight;
            }, 0, false);

        }

        vm.setIsGraph = function(graphFlag,index){
          graphFlag = !graphFlag;
          vm.conversationHistory[index].showGraph = graphFlag;
        }

        vm.goBack=function(){
            history.back();
        }

        var applyFnWithIndex = function (history,index) {
                vm.conversationHistory[index]=history;
        };

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
                    vm.insertChat("you",vm.typing);
                    vm.userText = "";
                }
        };

        //-- Clear Chat
        vm.resetChat();

        //-- Print Messages
        vm.askApi=function(query){

            vm.client.textRequest(query)
              .then(function(response) {
               var speech,displayText;
               try {
                 speech = response.result.fulfillment.speech;
                 vm.sessionId=response.sessionId;

                 if(!response.result.fulfillment.hasOwnProperty('displayText') && speech=="") {
                    var data={
                       "msgHdr" : {
                           "success" : 'true',
                           "error" : 'false',
                           "cd" : "",
                           "rsn" : ""
                       },
                       "msgBdy" : {
                           "userId" : "",
                           "userImage" : "",
                           "text" : "Sorry, we could not find anything for your search. Please can try a different query",
                           "attachments" : []
                       }
                   }
                   displayText=JSON.stringify(displayText);
                 }else{

                        if(!response.result.fulfillment.hasOwnProperty('displayText') && speech!=""){
                            var data={
                                "msgHdr" : {
                                    "success" : 'true',
                                    "error" : 'false',
                                    "cd" : "",
                                    "rsn" : ""
                                },
                                "msgBdy" : {
                                    "userId" : "",
                                    "userImage" : "",
                                    "text" : response.result.fulfillment.speech,
                                    "attachments" : []
                                }
                            }
                            displayText=JSON.stringify(data);
                        }
                        else{
                            //when displaytext is present
                            displayText=response.result.fulfillment.displayText;
                        }
                }
                vm.insertChat("you", displayText, 0);

               } catch(error) {
                  speech = "";
               }
             })
        }



        /**
         * Handle the received transcript here.
         * The result from the Web Speech Recognition will
         * be set inside a $rootScope variable. You can use it
         * as you want.
         */
        vm.displayTranscript=function() {
            console.log('displayTranscript called:',$rootScope.transcript);

            vm.userText = $rootScope.transcript;

            //This is just to refresh the content in the view.
            if (!$scope.$$phase) {
                $scope.$digest();
            }
            vm.sendUserQuery();
        }

        vm.sayIt = function (text) {
          
            var voices = speechSynthesis.getVoices();
            // Loop through each of the voices.
            voices.forEach(function(voice, i) {
                //console.log('voice:',voice);
            });

            var msg = new SpeechSynthesisUtterance(text);
            msg.volume = 1; // 0 to 1
            msg.rate = 1; // 0.1 to 10
            msg.pitch = 1; //0 to 2
            msg.lang = 'hi-IN';
            msg.voice=voices[8];
           
           //window.speechSynthesis.speak(msg);

            //pass it into the chunking function to have it played out.
            //you can set the max number of characters by changing the chunkLength property below.
            //a callback function can also be added that will fire once the entire text has been spoken.
            speechUtteranceChunker(msg, {
                chunkLength: 200
            }, function () {
                //some code to execute when done
                console.log('done');
            });
            
            

        };

        var speechUtteranceChunker = function (utt, settings, callback) {
            settings = settings || {};
            var newUtt;
            var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
            if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
                newUtt = utt;
                newUtt.text = txt;
                newUtt.addEventListener('end', function () {
                    if (speechUtteranceChunker.cancel) {
                        speechUtteranceChunker.cancel = false;
                    }
                    if (callback !== undefined) {
                        callback();
                    }
                });
            }
            else {
                var chunkLength = (settings && settings.chunkLength) || 160;
                var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
                var chunkArr = txt.match(pattRegex);

                if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
                    //call once all text has been spoken...
                    if (callback !== undefined) {
                        callback();
                    }
                    return;
                }
                var chunk = chunkArr[0];
                newUtt = new SpeechSynthesisUtterance(chunk);
                //newUtt.voice=voices[8];
                newUtt.lang="hi-IN";
                var x;
                for (x in utt) {
                    if (utt.hasOwnProperty(x) && x !== 'text') {
                        newUtt[x] = utt[x];
                    }
                }
                newUtt.addEventListener('end', function () {
                    if (speechUtteranceChunker.cancel) {
                        speechUtteranceChunker.cancel = false;
                        return;
                    }
                    settings.offset = settings.offset || 0;
                    settings.offset += chunk.length - 1;
                    speechUtteranceChunker(utt, settings, callback);
                });
            }

            if (settings.modifier) {
                settings.modifier(newUtt);
            }
            console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
            //placing the speak invocation inside a callback fixes ordering and onend issues.
            setTimeout(function () {
                window.speechSynthesis.speak(newUtt);
            }, 0);
        };

      

        vm.init();
}]);
