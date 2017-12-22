app.service('chatService', function(){
       var control,botType,isMobile;
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

                                }
                            });


                        revenueChart.render();
                        revenueChart = FusionCharts('revenue-chart');
                    });

                return control+'<br>';
            },
            getHtmlForTable:function(displayString,graphJson,chartId,containerId,graphTableArray){

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
            setIsMobile:function(flag){
                isMobile=flag;
            },
            getIsMobile:function(){
                return isMobile;
            },
            getHtmlForScrollButtons:function(jsonData){

                control =jsonData.openingText  +
                 '<div>';
                control = control + '<div class="scroll-row">';
                for(var i=0;i<jsonData.buttonNames.length;i++){
                    
                    control = control + '<div class="multiple-buttons" value="'+jsonData.buttonNames[i]+'" ng-click="' + jsonData.callBackFn + '($event)">';//'<button class="multiple-buttons">';
                    control = control + jsonData.buttonNames[i] + '</div>';
                }
                control = control + ' </div> </div>';
                return control;
            },

            getHtmlForButtons:function(jsonData){

                control ='<div class="vertical-btn-div">';
                control=control+'<div class="vertical-btn-hdr">'+jsonData.openingText+'</div>';
                for(var i=0;i<jsonData.buttonNames.length;i++){                    
                    control = control + '<div class="vertical-btns" value="'+jsonData.buttonNames[i]+'" ng-click="' + jsonData.callBackFn[i] + '($event)">'  ;
                    //control = control + '<div class="vertical-btns" value="'+jsonData.buttonNames[i]+'" ng-click="vm.callIntent(\'' + jsonData.callBackFn[i] + '\')">'  ;
                    
                    control = control + jsonData.buttonNames[i] + '</div>';
                }
                control = control + ' </div>';
                return control;
            },

            getHtmlForGraph2:function(displayString,formattedData,graphJson,chartId,containerId,varShowGraph){
                
                 /*'<strong>'+displayString + '</strong>'+*/
                  control='<div>' + formattedData + '</div>'+
                  '<div style="overflow-x:scroll" ng-show="' + varShowGraph + '">'+
                '<svg  id="'+ containerId +'"></svg></div>';
                this.getNvD3Graph(graphJson,containerId);
                return control;
            },
            getHtmlForTable2:function(displayString,graphJson,chartId,containerId,varShowGraph){
                control=
                 '<div ng-hide="'+ varShowGraph + '" >'+

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
            getHtmlForGraph3:function(attachment,chartId,containerId,varShowGraph){                

                control='<div ng-show="' + varShowGraph + '" id="'+ containerId +'" style="height:40vh;padding-top: 5px;"></div>';

                if ( FusionCharts(chartId)){
                     FusionCharts(chartId).dispose();
                }

                FusionCharts.ready(function() {
                    var revenueChart = new FusionCharts({
                        id: chartId,//'revenue-chart',
                        type:'column2d' , //column3d',//pie2d
                        renderAt: containerId,//'chart-container',
                        dataFormat: 'json',
                        width: "100%",
                        height: "100%",
                        dataSource: {
                          // Chart data goes here
                            chart: {
                                caption: attachment.title,
                                subcaption: "",
                                startingangle: "120",
                                showlabels: "1",
                                showlegend: "1",
                                enablemultislicing: "0",
                                slicingdistance: "15",
                                showpercentvalues: "1",
                                showpercentintooltip: "0",
                                plottooltext: "$label : $datavalue", //"Age group : $label Total visit : $datavalue",
                                theme: "fint"
                            },

                            data: attachment.data
                        }
                    });


                    revenueChart.render();
                    revenueChart = FusionCharts('revenue-chart');
                });



                
                return control+'<br>';
            },
            getHtmlForTable3:function(attachment,chartId,containerId,varShowGraph){
                control=
                 '<div ng-hide="'+ varShowGraph + '">'+
                    '<strong>'+attachment.title + '</strong><br><br>'+
                    '<table  class="table table-bordered table-striped">'+
                        '<thead>'+
                            '<tr>'+
                              '<th>'+attachment.labelHeader+'</th>'+
                              '<th>'+attachment.valueHeader+'</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>';

                    for(var i=1;i<attachment.data.length;i++){
                        control=control+
                         '<tr>'+
                              '<td>'+ attachment.data[i].label +'</td>'+
                              '<td>'+ attachment.data[i].value +'</td>'+
                            '</tr>';
                    }

                    control=control+
                            '</tbody>'+
                            '</table>'+
                            '</div>';

               return control;
            },
            getHtmlForScrollCards:function(attachment){
                var card;

                control = '<div class="scrolling-wrapper">';
                for(var i=0;i<attachment.data.length;i++){
                    card=attachment.data[i];
                    control = control + '<div class="card">'+
                                            '<img class="card-image"  src="' + card.image +'">'+
                                            '<div class="card-header">'+ card.title + '</div>' +
                                            '<div class="card-text">' + card.description +'</div>' +
                                            '<div class="card-text card-text-bottom" ng-click="vm.callIntent(\'' + card.callBackFn +'\')">' + card.postText +'</div>'+
                                        '</div>';
                }
                control = control + '</div>';
                return control;
            },
            getHtmlForDblColCard:function(attachment){
              control =  '<div class="direct-chat-msg" style="margin-left:50px; margin-bottom:2px !important;">';
              control = control + '<div>';
              control = control + '<div class="direct-chat-text-no-arrow">';

                control=control + '<div class="row" style="padding:5px 10px">'+
                            '<div class="col-xs-6 col-md-6 col-sm-6">'+
                                '<div class="attachment-title-font">'+ attachment.leftTitle + '</div>'+
                                '<div class="attachment-left-subtitle">'+ attachment.leftSubTitle +'</div>';

                                    for(var i=0;i<attachment.leftData.length;i++){
                                        control=control+'<div class="attachment-data-array">' + attachment.leftData[i] + '</div>';
                                    }

                control=control+'</div>'+
                                '<div class="col-xs-6 col-md-6 col-sm-6" style="padding-left:20px">'+
                                    '<div class="attachment-title-font font-color">'+ attachment.rightTitle +'</div>'+
                                    '<div class="rt-subtitle-btn" ng-click="vm.callIntent(\'' + attachment.rightSubTitleCallbackFn +'\')">'+ attachment.rightSubTitle +'</div>';

                                        for(var i=0;i<attachment.rightData.length;i++){
                                            control=control+'<div class="attachment-data-array">' + attachment.rightData[i] + '</div>';
                                        }

                control=control+'</div>'+
                            '</div>'
                            ;
                control=control+'</div>'+'</div>'+'</div>';
                return control;

            },
            getHtmlForKeyValueCard:function(attachment){
              control =  '<div class="direct-chat-msg" style="margin-left:50px; margin-bottom:2px !important;">';
              control = control + '<div>';
              control = control + '<div class="direct-chat-text-no-arrow">';

                control = control + '<div style="padding:5px 10px" class="attachment-title-font black-font">'+attachment.title +  '</div>'

                        for(var i=0;i<attachment.data.length;i++){
                            control=control+
                            '<div style="padding:0 10px" class="attachment-title-font">' + attachment.data[i].item + '</div>';

                             for(var j=0;j<attachment.data[i].details.length;j++){
                                control=control+
                                '<div style="padding:0 10px" class="row">'+
                                    '<div class="col-xs-6 col-md-6 col-sm-6">'+
                                        '<div>'+ attachment.data[i].details[j].label + '</div>'+
                                    '</div>'+
                                    '<div class="col-xs-6 col-md-6 col-sm-6" style="padding-left:20px">'+
                                        '<div>'+ attachment.data[i].details[j].value + '</div>'+
                                    '</div>'+
                                '</div>';  //row ends here
                            }

                            control=control+'<br>';
                        }
                        control=control;
                        control=control+'</div>'+'</div>'+'</div>';

                return control;
            },

            /** NEhA**/
            /** Please do not overwritw during merge **/
            /** Neha **/
            /** Genereate HTML for a text **/
            getHtmlForText:function(data){
                control =  '<div class="direct-chat-msg" style="margin-left:50px; margin-bottom:2px !important;">';
                control = control + '<div>';
                //control = control + '<img class="direct-chat-img" src={{history.image}} alt="message user image">';
                control = control + '<div class="direct-chat-text-no-arrow">';

                if(data.title != '')
                  control = control + '<div class="text-type-msg-title">' + data.title  + '</div>';

                if(data.subTitleType == 'stars'){
                    control = control + '<div class="text-type-msg-subtitle">';

                    var no = parseInt(data.subTitle);
                    for(var i=0;i<no;i++){
                        control = control +  '<span class="fa fa-star checked"></span>';
                    }
                    for (var i=no;i<5;i++){
                        control = control +  '<span class="fa fa-star unchecked"></span>';
                    }
                    control = control + '</div> <br>';
                }
                else if(data.subTitleType == 'text'){
                    control = control + '<div class="text-type-msg-subtitle">' + data.subTitle;
                    control = control + '</div> <br>';
                }
                 if(data.data.length != 0){
                     control = control + '<div class = "row">';
                     for (var i =0; i<data.data.length; i++){
                         control = control + '<div class="text-type-msg-desc">';

                        if(data.data[i].short == 'true'){
                            control = control + '<div class="col-xs-6 col-sm-6" style="padding-right : 2px !important; padding-top: 15px !important; ">';
                            if(data.data[i].type == 'pdf'){
                                  control = control + '<span><a  target="_blank" href=' + data.data[i].link + '><img class="label-icon" src="alfredApp/images/doc.png" alt="message user image"></a></span>';
                            }
                            else if(data.data[i].type == 'video'){
                                control = control + '<span><a  target="_blank" href=' + data.data[i].link + '><img class="label-icon" src="alfredApp/images/movieIcon.png" alt="message user image"></a></span>';
                            }

                            if(data.data[i].label != ''){
                                if(data.data[i].type == 'text')
                                    control = control + '<div>' + data.data[i].label  + ':</div>';
                                else
                                    control = control + '<div class="text-type-msg-desc-10" >' + data.data[i].label  + ':</div>';
                            }
                            if(data.data[i].value != ''){
                              if(data.data[i].type == 'text')
                                  control = control + '<div>' + data.data[i].value   + '</div>';
                              else
                                  control = control + '<div class="text-type-msg-desc-10" >' + data.data[i].value  + '</div>';
                            }
                            control = control + '</div>';
                        }
                        else{
                            control = control + '<div class="col-xs-12">';
                            if(data.data[i].type == 'pdf'){
                                  control = control + '<span><a  target="_blank" href=' + data.data[i].link + '><img class="label-icon" src="alfredApp/images/doc.png" alt="message user image"></a></span>';
                            }
                            if(data.data[i].type == 'video'){
                                control = control + '<span><a  target="_blank" href=' + data.data[i].link + '><img class="label-icon" src="alfredApp/images/movieIcon.png" alt="message user image"></a></span>';
                            }
                            if(data.data[i].label != ''){
                                if(data.data[i].type == 'text')
                                    control = control + '<div>' + data.data[i].label  + ':</div>';
                                else
                                    control = control + '<div class="text-type-msg-desc-10" >' + data.data[i].label  + ':</div>';
                            }
                            if(data.data[i].value != ''){
                                if(data.data[i].type == 'text')
                                    control = control + '<div>' + data.data[i].value   + '</div>';
                              else
                                    control = control + '<div class="text-type-msg-desc-10" >' + data.data[i].value  + '</div>';
                            }
                            control = control + '</div>';
                        }
                         control = control + '</div>';
                     }
                     control = control + '</div>';
                }
                control = control + '</div>';
                control = control + '</div>';
                control = control + '</div>';
                return control;
            },
            getHtmlForButtons5:function(data){
                //We could have multiple button types, checkbox, radio etc
                if(data.type == "buttons"){
                    if(data.data.length == 2 && (data.title == '' && data.text == '')){
                        control = '<div class="row" style="margin-left:35px">';

                        for(var i = 0; i<data.data.length ;i++ ){
                            if(i==0){
                                control = control +'<div class="col-xs-6 col-sm-6 padding-right-0">';
                                control = control + '<div class="btn btn-chat border-btn-left-5" ng-click="vm.callIntent(\'' + data.data[i].callBackFn + '\')">';
                                control = control + data.data[i].text;
                                control = control + '</div>';
                                control = control + '</div>';
                            }
                            if(i==1){
                              control = control +'<div class="col-xs-6 col-sm-6 padding-left-0">';
                              control = control + '<div class="btn btn-chat border-btn-right-5" ng-click="vm.callIntent(\'' + data.data[i].callBackFn + '\')">';
                              control = control + data.data[i].text;
                              control = control + '</div>';
                              control = control + '</div>';
                            }
                        }
                        control = control + '</div>';
                    }

                }

                return control;

            },
            /** Neha end **/

            //kriti-new graph
            getNvD3Graph:function(graphJson,containerId){
               var graphJsonWithoutHeader=[];
                for(var i=1;i<graphJson.length;i++){
                    graphJsonWithoutHeader[i-1]=graphJson[i];
                }

                var graphData=[{key:"",values:graphJsonWithoutHeader}];
                
                nv.addGraph(function() {
                  var chart = "";
                  chart=nv.models.discreteBarChart()
                      .x(function(d) { return d.label })    
                      .y(function(d) { return d.value })
                      .staggerLabels(true)      
                      .showValues(false)                        
                      ;

                  d3.select('#'+ containerId)
                      .datum(graphData)
                      .call(chart)
                      ;

                  chart.margin({bottom: 20});
                    var xTicks = d3.selectAll('.nv-x.nv-axis');// > g').selectAll('g');
                    xTicks
                      .selectAll('text')
                      .attr('transform', function(d,i,j) {                        
                        return 'translate (0, 0) rotate(-40 0,0) '                          
                       })
                      .attr('style',function(){return 'font-size: 8px !important; text-anchor: end;'}) ; 

                  //nv.utils.windowResize(chart.update);
            
                  return chart;
                });        
            }
       }
    })
