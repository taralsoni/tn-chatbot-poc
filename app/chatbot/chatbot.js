'use strict';

angular.module('TN_App.chatbot', ['ui.router'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('chatbot', {
            url: '/chatbot',
            templateUrl: 'chatbot/chatbot.html',
            controller: 'chatbotCtrl'
        });
    }])

    /**
     * Highlights text that matches $select.search.
     *
     * Taken from AngularUI Bootstrap Typeahead
     * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
     */
    .filter('highlight', function() {
        function escapeRegexp(queryToEscape) {
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function(matchItem, query) {
            return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
        };
    })

    .controller('chatbotCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
        var vm = this;
        vm.days = ['Today', 'Tomorrow', moment().add(2, 'days').format('dddd MMM DD'), moment().add(3, 'days').format('dddd MMM DD'), moment().add(4, 'days').format('dddd MMM DD'), moment().add(5, 'days').format('dddd MMM DD'), moment().add(6, 'days').format('dddd MMM DD'), moment().add(7, 'days').format('dddd MMM DD')]
        vm.groupBy = [];
        vm.actions = [];
        vm.webSocketUrl = "";

        var _ws;
        vm.notification = [];
        vm.postData = {};
        $http({
            method: "post",
            url: 'https://slack.com/api/rtm.connect',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({ token: 'xoxp-185596757732-185808511269-261288990199-8b29dbfa4f5723d41acc5c37e3413007' })
        }).success(function(result) {
            vm.webSocketUrl = result.url;
            _ws = new WebSocket(vm.webSocketUrl);
            _ws.onmessage = function(event) {
                vm.finalOutput = [];
                vm.finalOutput.push(JSON.parse(event.data));
                // console.log("vm.finalOutput: ", vm.finalOutput);

                angular.forEach(vm.finalOutput, function(value, key) {
                    if (value.type == "message" && value.text != undefined) {
                        // vm.notification.push(value.text);
                        vm.insertChat("you", value.text, 0);
                        vm.postData = angular.copy(value);
                    }
                });

                var meetingActions = !(vm.isEmptyVal(vm.finalOutput[0].attachments)) ? vm.finalOutput[0].attachments[0].actions : "";
                if (!vm.isEmptyVal(meetingActions)) {
                    vm.buttonLabel = vm.finalOutput[0].attachments[0].actions[0];
                    vm.daySelect = vm.finalOutput[0].attachments[0].actions[1];
                    angular.forEach(vm.finalOutput[0].attachments[0].actions, function(value, key) {
                        if (value instanceof Object) {
                            angular.forEach(value.option_groups, function(action) {
                                vm.groupBy.push(action.text);
                                angular.forEach(action.options, function(option) {
                                    option.grouplabel = action.text;
                                    vm.actions.push(option);
                                });
                            })
                        }
                    })
                }
                $scope.$apply();
            }
        });

        vm.updateEvent = function(msg) {
            vm.postData.text = msg;
            _ws.send(JSON.stringify(vm.postData));
            _ws.onerror = function(evt) { console.log("Error", evt) };
        }

        vm.formatString = function(text) {

            if (text.indexOf("https://my.busybotapp.com/tasks/") > -1) {
                // Sameple string:
                // I've added the task *<https://my.busybotapp.com/tasks/ZYkBSvSZLSExRZEHZ?teamId=T5FHJN9MJ|klkll>*, and assigned it to you

                var textArray = text.split('*');


                var textString = textArray[0]; // I've added the task
                var textLink = textArray[1].substring(1, textArray[1].length).substring(0, textArray[1].length - 2); //<https://my.busybotapp.com/tasks/ZYkBSvSZLSExRZEHZ?teamId=T5FHJN9MJ|klkll>
                var textTaskName = textArray[1].split('|')[1].substring(0, textArray[1].length - 1)
                textTaskName = textTaskName.substring(0, textArray[1].length - 1) //klkll

                //Building the string
                var textString = textString + '<a href =' + textLink + '>' + textTaskName.slice(0, -1) + '</a>' + textArray[2];
                // vm.showTemplate = true;
                return $sce.trustAsHtml(textString);

            }
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




        vm.me = {
            avatar: "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48"
        };

        vm.you = {
            avatar: "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg"
        };

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
                vm.updateEvent(text); // Shoot the msg to Slack
                control = '<li style="width:100%">' +
                    '<div class="msj macro">' +
                    '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + vm.me.avatar + '" /></div>' +
                    '<div class="text text-l">' +
                    '<p>' + text + '</p>' +
                    '<p><small>' + date + '</small></p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            } else {
                control = '<li style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<p>' + text + '</p>' +
                    '<p><small>' + date + '</small></p>' +
                    '</div>' +
                    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + vm.you.avatar + '" /></div>' +
                    '</li>';
            }
            setTimeout(
                function() {
                    $("ul").append(control);

                }, time);

        }

        vm.resetChat = function() {
            $("ul").empty();
        }

        $(".mytext").on("keyup", function(e) {
            if (e.which == 13) {
                var text = $(this).val();
                if (text !== "") {
                    vm.insertChat("me", text);
                    $(this).val('');
                }
            }
        });

        //-- Clear Chat
        vm.resetChat();

        //-- Print Messages
        vm.insertChat("you", "Welcome...", 0);
        // insertChat("you", "Hi, Pablo", 1500);
        // insertChat("me", "What would you like to talk about today?", 3500);
        // insertChat("you", "Tell me a joke",7000);
        // insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
        // insertChat("you", "LOL", 12000);


    }]);