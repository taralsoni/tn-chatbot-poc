app.controller('bankingCtrl', ['$scope', '$compile','chatService','$sce','$http','$timeout', 
                               function($scope,$compile,chatService,$sce,$http,$timeout) {
		
	
	var input;
	sessionid = Date.now();
	
	
      var banking = this;
      banking.conversationHistory = [];
  
      banking.me = {avatar: "https://randomuser.me/api/portraits/med/men/83.jpg"};

      banking.you = {avatar: "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg"};
       
      //
      banking.buttonCallBackFunction = function(e){
    	  var buttonValue = e.target.getAttribute('value');
            console.log("Button was clicked");
            var history = {};
            history.user = 'Sheldon Fernandes';
            history.image = banking.me.avatar;
            control = buttonValue;
            history.text =  $sce.trustAsHtml(control);
            history.ts = banking.formatAMPM(new Date());
            banking.conversationHistory.push(history);
            banking.execute(control);
            
      	  
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
    	  var history = {};
            history.user = 'Sheldon Fernandes';
            history.image = banking.me.avatar;
            control = banking.userText;
            history.text =  $sce.trustAsHtml(control);
            history.ts = banking.formatAMPM(new Date());
            banking.conversationHistory.push(history);
        
            $timeout(function() {
              var scroller = document.getElementById("autoscroll");
              scroller.scrollTop = scroller.scrollHeight;
            }, 0, false);
        
      }
      
      
      //User query to be displayed on chat screen
      banking.sendUserQuery = function(){
          var text = banking.userText;
          if (text !== "") {
              banking.insertChat("me", text);
              banking.userText = "";
              input = text;
			  banking.execute(text);
          }            
      };
      
      
      banking.setIsGraph = function(graphFlag,index){
          graphFlag = !graphFlag;
          banking.conversationHistory[index].showGraph = graphFlag;
      }
      
      
      function IsJsonString(str) {
  		try {
  			sessionid
  			JSON.parse(str);
  		} catch (e) {
  			return false;
  		}
  		return true;
  	}

	
	banking.execute= function(text)
	{
		   	  
    	//hit api.ai on the user input
  		var accessToken = "0f28eeab45ad41139d8dea2842aa83e9";
  		var baseUrl = "https://api.api.ai/v1/";
  		$http({

  			method: 'POST',
  			url: baseUrl + "query/",
  			headers: {
  				"Authorization": "Bearer " + accessToken},
  			"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  			data: JSON.stringify({
  				query: text,
  				lang: "en",
  				sessionId: sessionid
  			}),
  		}).
  		success(function(data, status) 
  				{
  			var obj = JSON.parse(JSON.stringify(data));
  			
  			
  		//if the output from api.ai is the one below hit the web service and get the duration/time for which data is present
  			if ((obj.result.speech == "Please tell the Year you are looking for")||(obj.result.speech == "Please tell the Month you are looking for")) 
			{

				$http({
					method: "POST",
					url: "http://40.71.38.237:8080/Hadoop/apiai/timeFrame",
					data: JSON.stringify(obj),
					header:{},
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
						
				}).
				success(function(input, status)
						{
					 var timefrs=[];
					 var tempArr=[];
					 var tempArr1=[];
					 var tempArr2=[];
					 
					 tempArr = JSON.stringify(input);
					 
					tempArr = tempArr.replace(/\"/g, "");
					tempArr = tempArr.substring(1, tempArr.length - 1);
					 
					tempArr = tempArr.split(":");
					tempArr1 = tempArr.join();
					tempArr2 = tempArr1.split(",");

					var m=0;
					var n=0;
					
					for (m in tempArr2) {
						if (m % 2 == 0) {
							timefrs[n] = tempArr2[m];
							n++;
							m++;}}
					
					
					//For buttons
		            var history = {};
		            var jsonData = {
		                'openingText' : "Please tell the Time frame you are looking for you are looking for",
		                'buttonNames' : timefrs,
		                'callBackFn' : 'banking.buttonCallBackFunction'    
		            }
		            var control = chatService.getHtmlForButtons(jsonData); 
		            history.image = banking.you.avatar;
		            history.user = 'Rosey@Banking';
		            history.text = $sce.trustAsHtml(control);
		            history.ts = banking.formatAMPM(new Date());
		            banking.conversationHistory.push(history);
					
						});
//						error(function(data, status) {
//							console.log(data);});
			}
  		else if (obj.result.speech == "done")
  			{

				$http({
					method: "POST",
					url: "http://40.71.38.237:8080/Hadoop/apiai/data",
					data: JSON.stringify(obj),
					header:{},
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
					
					
				}).
				success(function(input, status)
						{
					if(!(JSON.stringify(input.data)=="{}"||JSON.stringify(input)=="{}"))						
					{
						var obj1 = JSON.parse(JSON.stringify(input));
						var cars = new Array()
						
						var formattedData="";
						for (var k in input)
							if (k != "data" && input[k] != "all")
								formattedData = formattedData + "<br/>" + k + " " + input[k];

						formattedData = formattedData + "\n"
								

						var chartData = [];
						var chartHeaders = [];
						var tempArray = [];
						var tempArray1 = [];
						var tempArray2 = [];
						var strhead = [];
						var xLabelHead = "";
						var yLabelHead = "";
						var strnum = [];
						var xLabels = [];


						chartData = JSON.stringify(input.data.data);
						chartHeaders = JSON.stringify(input.data.header);

						chartData = chartData.replace(/\"/g, "");
						chartData = chartData.substring(1, chartData.length - 1);

						chartHeaders = chartHeaders.replace(/\"/g, "");
						chartHeaders = chartHeaders.substring(1, chartHeaders.length - 1);


						tempArray = chartData.split(":");
						tempArray1 = tempArray.join();
						tempArray2 = tempArray1.split(",");

						strhead = chartHeaders.split(":");
						xLabelHead = strhead[0];
						yLabelHead = strhead[1];

						var m = 0,
						n = 0,
						p = 0;

						for (m in tempArray2) {
							if (m % 2 == 0) {
								xLabels[n] = tempArray2[m];
								n++;
								m++;
							} else {
								strnum[p] = tempArray2[m];
								p++;
								m++;
							}

						}
						var i=0;
						var chartValues = [];
						chartValues[i]={"value":strhead[1],"label":strhead[0]};
						i++;
						for (j in strnum)
						{
							chartValues[i]={ "value" : strnum[j] , "label" : xLabels[j] };
							i++;
						}
        
						//For graph and table
			            var history = {};
			            history.image = banking.you.avatar;
			            history.user = 'Rosey@Banking';
			            //history.text = $sce.trustAsHtml(control);
			            history.ts = banking.formatAMPM(new Date());
			            history.graph = true;
			            history.showGraph = true;
			        
			            
			             var jsonData = {
			                'displayString' : 'Displaying data for'+"<br/>"+formattedData,   
			                'data': {
			                    'graphData' : chartValues
			                    }
			              }

			              var fnData = {
			                    'callBackFn' : 'banking.setIsGraph'     
			              }
			             
			             banking.chartIndex=banking.chartIndex+1;
			              banking.containerId='chart-container-' + banking.chartIndex;
			              banking.chartId='revenue-chart-' + banking.chartIndex;  

			            /* Html for Graph*/ control=chatService.getHtmlForGraph2(jsonData.displayString,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
			             
			             /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
			                  
			              /*html for toggle button */
			              control=control+'<div class="row"><button type="submit" class="col-sm-3 col-md-3 btn btn-success" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' style="margin-left: 20px;margin-right: 20px;">  Toggle view </button></div>';
			        
			              history.text = $sce.trustAsHtml(control);
			              banking.conversationHistory.push(history);			
						
					}
				else
					{
					
					  var history = {};
			          history.image = banking.you.avatar;
			          history.text =  "Unfortunately data is not present for the combination of data";
			          history.user = 'Rosey@Banking';
			          history.ts =  banking.formatAMPM(new Date());
			          banking.conversationHistory.push(history);
			      	
					}
					}).
					error(function(data, status) {});
  			}
  			
  		//if the output from api.ai is not done then display the output to the user to get required output
			else 
			{
				
				test="";
				
				function nth_occur(string, char, nth) {
					var firstIndex = string.indexOf(char);
					var length_firstIndex = firstIndex + 1;

					if (nth == 1) {
						return firstIndex;
					} else {
						var string_after = string.slice(length_firstIndex);
						var next_occur = nth_occur(string_after, char, nth - 1);

						if (next_occur === -1) {
							return -1;
						} else {
							return length_firstIndex + next_occur;
						}
					}
				}

				function nth_occur_fordot(string, char, nth) {
					var firstIndex = string.indexOf(char) + 1;
					var length_firstIndex = firstIndex + 1;

					if (nth == 1) {
						return firstIndex;
					} else {
						var string_after = string.slice(length_firstIndex);
						var next_occur = nth_occur_fordot(string_after, char, nth - 1);

						if (next_occur === -1) {
							return -1;
						} else {
							return length_firstIndex + next_occur;
						}
					}
				}

	
				
				
			
				if (data.result.metadata.intentName == "what are my options") {
					var outputAPI = JSON.stringify(data.result.speech);
					var outputAPISubstring = outputAPI;
					outputAPISubstring = outputAPISubstring.substring(1, outputAPISubstring.indexOf("<"));

					var outputData = [];

					var i = 0,
					j = 0,
					z = 1;
					for (i in outputAPI) {
						var startSymbol = nth_occur_fordot(outputAPI, ".", z);
						var endSymbol = nth_occur(outputAPI, "<br />", z);
						if (endSymbol == -1)
							break;
						else {
							outputData[j] = outputAPI.substring(startSymbol, endSymbol);
							j++;
							z++;

						}
					}
					
					//For buttons
		            var history = {};
		            var jsonData = {
		                'openingText' : outputAPISubstring,
		                'buttonNames' : outputData,
		                'callBackFn' : 'banking.buttonCallBackFunction'    
		            }
		            var control = chatService.getHtmlForButtons(jsonData); 
		            history.image = banking.you.avatar;
		            history.user = 'Rosey@Banking';
		            history.text = $sce.trustAsHtml(control);
		            history.ts = banking.formatAMPM(new Date());
		            banking.conversationHistory.push(history);
		        		

			
			}else if ((data.result.metadata.intentName == "Account_Count_fieldwise") ||
					(data.result.metadata.intentName == "Account_Count_fieldwise_context") ||
					(data.result.metadata.intentName == "Achievement_fieldwise") ||
					(data.result.metadata.intentName == "Achievement_fieldwise_context") ||
					(data.result.metadata.intentName == "CustomerCount_fieldwise") ||
					(data.result.metadata.intentName == "CustomerCount_fieldwise_context") ||
					(data.result.metadata.intentName == "Top_performing_branches_fieldwise") ||
					(data.result.metadata.intentName == "Top_performing_branches_fieldwise_context") ||
					(data.result.metadata.intentName == "Unique_customers_addition_fieldwise") ||
					(data.result.metadata.intentName == "Unique_customers_addition_fieldwise_context") ||
					(data.result.metadata.intentName == "Variance_fieldwise") ||
					(data.result.metadata.intentName == "Variance_fieldwise_context")) {
				var initspeech = JSON.stringify(data.result.speech);
				var startspeech = initspeech;
				startspeech = startspeech.substring(1, startspeech.indexOf("<"));

				var str007 = [];

				var i = 0,
				j = 0,
				z = 1;
				for (i in initspeech) {
					var startsym = nth_occur_fordot(initspeech, ".", z);
					var endsym = nth_occur(initspeech, "<br />", z);
					if (endsym == -1)
						break;
					else {
						str007[j] = initspeech.substring(startsym, endsym);
						j++;
						z++;

					}
				}
				
				//For buttons
	            var history = {};
	            var jsonData = {
	                'openingText' : startspeech,
	                'buttonNames' : str007,
	                'callBackFn' : 'banking.buttonCallBackFunction' 
	            }
	            var control = chatService.getHtmlForButtons(jsonData); 
	            history.image = banking.you.avatar;
	            history.user = 'Rosey@Banking';
	            history.text = $sce.trustAsHtml(control);
	            history.ts = banking.formatAMPM(new Date());
	            banking.conversationHistory.push(history);
	        	
				
			}else {
				test = data.result.speech;
				var history = {};
		          history.image = banking.you.avatar;
		          history.text =  test;
		          history.user = 'Rosey@Banking';
		          history.ts =  banking.formatAMPM(new Date());
		          banking.conversationHistory.push(history);
				
			}
		}
			}).
			error(function(data, status) {});
	}
  
  
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
         /*var history = {};
          history.user = 'Sheldon Fernandes';
          history.image = banking.me.avatar;
          control = 'Get me banking data';
          history.text =  $sce.trustAsHtml(control);
          history.ts = banking.formatAMPM(new Date());
          banking.conversationHistory.push(history);*/
    	  	
    	  
           
        
              //Scroll to the bottom of the screen
              $timeout(function() {
                  var scroller = document.getElementById("autoscroll");
                  scroller.scrollTop = scroller.scrollHeight;
              }, 0, false);
      }
      banking.init();
}]);

