app.controller('bankingCtrl', ['$scope', '$compile','chatService','$sce','$http', function($scope,$compile,chatService,$sce,http) {
  
      var banking = this;
      banking.conversationHistory = [];
  
      banking.me = {
            avatar: "https://randomuser.me/api/portraits/med/men/83.jpg"
      };

      banking.you = {
            avatar: "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg"
      };
       
      //
      banking.buttonCallBackFunction = function(){
            console.log("Button was clicked");
      }
      
      //Function to format date displayed on screen
      banking.formatAMPM = function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
      }
      
      
      //Function to display user query on screen{
      banking.insertChat = function(){
          //User Interaction
            history.user = 'Sheldon Fernandes';
            history.image = banking.me.avatar;
            control = banking.userText;
            history.text =  $sce.trustAsHtml(control);
            history.ts = banking.formatAMPM(new Date());
            banking.conversationHistory.push(history);
      }
      
      
      //User query to be displayed on chat screen
      banking.sendUserQuery = function(){
          var text = banking.userText;
          if (text !== "") {
              banking.insertChat("me", text);
              banking.userText = "";
          }            
      };
      
  
  
      banking.init = function(){
            
            var control;
            banking.chartIndex=0;
          
            var history = {};
            history.image = banking.you.avatar;
            history.text =  'Hi Rosey here. How can I help you!';
            history.user = 'Rosey@Banking';
            history.ts =  banking.formatAMPM(new Date());
            banking.conversationHistory.push(history);
        
        
            //User Interaction
            var history = {};
            history.user = 'Sheldon Fernandes';
            history.image = banking.me.avatar;
            control = 'Get me banking data';
            history.text =  $sce.trustAsHtml(control);
            history.ts = banking.formatAMPM(new Date());
            banking.conversationHistory.push(history);
        
        
            //For buttons
            var history = {};
            var jsonData = {
                'openingText' : 'Hey, Showing you monthly results',
                'buttonNames' : ['Button1','Button2','Button3','Button4','Button5'],
                'callBackFn' : 'banking.buttonCallBackFunction'     
            }
            var control = chatService.getHtmlForButtons(jsonData); 
            history.image = banking.you.avatar;
            history.user = 'Rosey@Banking';
            history.text = $sce.trustAsHtml(control);
            history.ts = banking.formatAMPM(new Date());
            banking.conversationHistory.push(history);
        
        
           //For graph and table
            history.image = banking.you.avatar;
            history.user = 'Rosey@Banking';
            //history.text = $sce.trustAsHtml(control);
            history.ts = banking.formatAMPM(new Date());
            history.graph = true;
            history.showGraph = true;
        
            
             var jsonData = {
                'displayString' : 'Displaying data for Graph',   
                'data': {
                    'graphData' : [
                                    {
                                        'label': "Teenage",
                                        'value': "1250400"
                                    },
                                    {
                                        'label': "Adult",
                                        'value': "1463300"
                                    },
                                    {
                                        'label': "Mid-age",
                                        'value': "1050700"
                                    },
                                    {
                                        'label': "Senior",
                                        'value': "491000"
                                    }
                                ]
                    }
              }

              var jsonData = {
                    'callBackFn' : 'banking.setIsGraph'     
              }

//              banking.graphTableArray[banking.chartIndex]=true;
//              banking.graphJsonArray[banking.chartIndex]=jsonData.data.graphData;
//
              banking.containerId='chart-container-' + banking.chartIndex;
              banking.chartId='revenue-chart-' + banking.chartIndex;  

              control=chatService.getHtmlForGraph(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,jsonData.graphTableArray);                  
                    
              control=control+'<button type="submit" class="btn btn-block btn-success" ng-click="' + jsonData.callBackFn + '(' + banking.chartIndex + ','  + vm.conversationHistory.length + ',\'' + jsonData.displayString + '\',\''  + jsonData.containerId + '\',\'' + jsonData.chartId +'\')" style="margin-left: 20px;margin-right: 20px;width:15%!important">  Toggle view </button>';
              control=control+chatService.getHtmlForTable(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,jsonData.graphTableArray);
               
            
          
      }
  
      banking.init();
}]);