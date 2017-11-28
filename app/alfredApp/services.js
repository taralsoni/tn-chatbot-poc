app.service('chatService', function(){
       var control,botType;
       var csScope=this;
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
            getHtmlForGraph:function(displayString,graphJson,chartId,containerId,graphTableArray){
                var graphJsonWithoutHeader=[];
                for(var i=1;i<graphJson.length;i++){
                    graphJsonWithoutHeader[i-1]=graphJson[i];
                }

                control= '<strong>'+displayString + '</strong><br>'+

                    '<div ng-show="'+ graphTableArray[containerId.charAt(containerId.length-1)] + '" id="'+ containerId +'"></div>';
                                             
                    if ( FusionCharts(chartId)){
                         FusionCharts(chartId).dispose();
                    }

                        FusionCharts.ready(function() {               
                            var revenueChart = new FusionCharts({
                                id: chartId,//'revenue-chart',
                                type:'column3d' , //column3d',//pie2d
                                renderAt: containerId,//'chart-container',
                                dataFormat: 'json',
                                width: "100%",
                                height: "100%",
                                dataSource: {
                                  // Chart data goes here
                                    chart: {
                                        caption: "",
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

                                    data: graphJsonWithoutHeader
                                        /*[
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
                        revenueChart = FusionCharts('revenue-chart');
                    });
                
                return control+'<br>';
            },
            getHtmlForTable:function(displayString,graphJson,chartId,containerId,graphTableArray){
                

                /*var graphJson=[
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
                                ];*/

                control= 
                 '<div ng-hide="'+ graphTableArray[containerId.charAt(containerId.length-1)] + '" class="box-body">'+
                    '<strong>'+displayString + '</strong><br>'+
                    '<table  class="table table-bordered table-striped">'+
                        '<thead>'+
                            '<tr>'+
                              '<th>'+graphJson[0].label+'</th>'+
                              '<th>'+graphJson[0].value+'</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>';

                    for(var i=1;i<graphJson.length;i++){
                        control=control+
                         '<tr>'+
                              '<td>'+ graphJson[i].label +'</td>'+
                              '<td>'+ graphJson[i].value +'</td>'+
                            '</tr>';
                    }  

                    control=control+
                            '</tbody>'+
                            '</table>'+                     
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
                    control = control + '<div class="col-xs-6 col-sm-6 col-md-2" style="margin-bottom: 10px;"> <button type="submit" class="btn btn-block btn-success" ng-click="' + jsonData.callBackFn + '()" style="margin-left: 20px;margin-right: 20px;">' + jsonData.buttonNames[i] + '</button>' + '</div>';
                }
                control = control + '</row>';
                return control;
            },
          
            getHtmlForGraph2:function(displayString,graphJson,chartId,containerId,varShowGraph){
                var graphJsonWithoutHeader=[];
                for(var i=1;i<graphJson.length;i++){
                    graphJsonWithoutHeader[i-1]=graphJson[i];
                }

                control= '<strong>'+displayString + '</strong><br>'+

                    
                    '<div ng-show="' + varShowGraph + '" id="'+ containerId +'"></div>';
              
                    //'<div ng-show="' + varShowGraph + '" id="'+ containerId +'"></div>';
                                             
                    if ( FusionCharts(chartId)){
                         FusionCharts(chartId).dispose();
                    }

                        FusionCharts.ready(function() {               
                            var revenueChart = new FusionCharts({
                                id: chartId,//'revenue-chart',
                                type:'column3d' , //column3d',//pie2d
                                renderAt: containerId,//'chart-container',
                                dataFormat: 'json',
                                width: "100%",
                                height: "100%",
                                dataSource: {
                                  // Chart data goes here
                                    chart: {
                                        caption: "",
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

                                    data: graphJsonWithoutHeader
                                        /*[
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
                        revenueChart = FusionCharts('revenue-chart');
                    });
                
                return control+'<br>';
            },
            getHtmlForTable2:function(displayString,graphJson,chartId,containerId,varShowGraph){
                control= 
                 '<div ng-hide="'+ varShowGraph + '" class="box-body">'+
                    '<strong>'+displayString + '</strong><br>'+
                    '<table  class="table table-bordered table-striped">'+
                        '<thead>'+
                            '<tr>'+
                              '<th>'+graphJson[0].label+'</th>'+
                              '<th>'+graphJson[0].value+'</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>';

                    for(var i=1;i<graphJson.length;i++){
                        control=control+
                         '<tr>'+
                              '<td>'+ graphJson[i].label +'</td>'+
                              '<td>'+ graphJson[i].value +'</td>'+
                            '</tr>';
                    }  

                    control=control+
                            '</tbody>'+
                            '</table>'+                     
                            '</div>';
                
               return control;
            },
            getHtmlForCard:function(attachment){
                var card;
                control='<div class="scrolling-wrapper" style="height:20vh;">';

                for(var i=0;i<attachment.data.length;i++){
                    card=attachment.data[i];
                    control=control+
                        '<div class="card"  style="margin:0;">'+
                            '<div class="row" style="white-space:normal">'+
                                '<div class="col-xs-1 col-sm-5 col-md-5" >'+
                                    '<img src="'+ card.image + '" alt="Avatar" style="width:10vw; height: 20vh;">'+
                                '</div>'+
                                '<div class="container col-xs-10 col-sm-7 col-md-7" style="padding-left: 40px !important;">'+
                                 
                                    '<h5><b>' + card.title +'</b></h5> '+
                                    '<h6>'+ card.description +'</h6>'+
                                    '<br>'+
                                    '<h6>'+ card.postText +'</h6> '+
                                '</div>'+
                                /*'<div class=" col-xs-7 col-sm-7 col-md-7"></div>'+*/
                            '</div>'+
                        '</div>';
                }
                control=control+'</div>';
                return control;    
            },
            getHtmlForDblColCard:function(attachment){
                control='<div class="row" style="padding:5px 10px">'+
                            '<div class="col-xs-6 col-md-6 col-sm-6">'+
                                '<div class="attachment-title-font">'+ attachment.leftTitle + '</div>'+
                                '<div>'+ attachment.leftSubTitle +'</div>';

                                    for(var i=0;i<attachment.leftData.length;i++){                                        
                                        control=control+'<div>' + attachment.leftData[i] + '</div>';
                                    }  

            control=control+'</div>'+
                            '<div class="col-xs-6 col-md-6 col-sm-6">'+
                                '<div style="float:right"  class="attachment-title-font font-color">'+ attachment.rightTitle +'</div>'+
                                '<div style="float:right;cursor: pointer;"  class="black-font" ng-click="vm.callNextIntent(\'' + attachment.rightSubTitleCallbackFn +'\')">'+ attachment.rightSubTitle +'</div>';

                                    for(var i=0;i<attachment.rightData.length;i++){
                                        control=control+'<div style="float:right">' + attachment.rightData[i] + '</div>';
                                    }   

            control=control+'</div>'+
                        '</div>'+
                        '<hr>';

            return control;                

            },
            getHtmlForKeyValueCard:function(attachment){

                control='<div style="padding:5px 10px" class="attachment-title-font black-font">'+attachment.title +  '</div>'

                        for(var i=0;i<attachment.data.length;i++){                                        
                            control=control+
                            '<div style="padding:0 10px" class="attachment-title-font">' + attachment.data[i].item + '</div>';
                                                    
                             for(var j=0;j<attachment.data[i].details.length;j++){ 
                                control=control+
                                '<div style="padding:0 10px" class="row">'+
                                    '<div class="col-xs-6 col-md-6 col-sm-6">'+
                                        '<div>'+ attachment.data[i].details[j].label + '</div>'+
                                    '</div>'+
                                    '<div class="col-xs-6 col-md-6 col-sm-6">'+
                                        '<div style="float:right">'+ attachment.data[i].details[j].value + '</div>'+
                                    '</div>'+
                                '</div>';  //row ends here                          
                            } 

                            control=control+'<br>';  
                        }       
                        control=control+'<hr>';

                return control;
            }
       } 
    })