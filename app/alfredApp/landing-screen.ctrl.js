app.controller('landingScreenCtrl', ['$scope','$state','chatService', function($scope,$state,chatService) {
        var ctrl = this;
        

        ctrl.goToBot=function(botName){
            ctrl.selectedBot=botName;
            chatService.setBotType(botName);
            /*if(botName=='fintech'){
                $state.transitionTo('fintech');                
            }else if(botName=='insurance'){
                $state.transitionTo('insurance');
            }else if(botName=='banking'){
                $state.transitionTo('banking');
            }*/
        }
}]);