app.controller('landingScreenCtrl', ['$scope','$state','chatService', function($scope,$state,chatService) {
        var ctrl = this;

        ctrl.user_avatar= "https://randomuser.me/api/portraits/med/men/83.jpg";
        

        ctrl.goToBot=function(botName){
            ctrl.selectedBot=botName;
            chatService.setBotType(botName);
        }

        ctrl.goBackToLandingScreen=function(){
            chatService.setBotType("");
            ctrl.selectedBot="";
        }
}]);