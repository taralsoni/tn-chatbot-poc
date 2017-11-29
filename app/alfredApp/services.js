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
                control='<div class="scrolling-wrapper" style="height:15vh;width:30vw">';

                for(var i=0;i<attachment.data.length;i++){
                    card=attachment.data[i];
                    control=control+
                        '<div class="card"  style="margin:0;">'+
                            '<div class="row">'+
                                '<div class="col-xs-1 col-sm-5 col-md-5" >'+
                                    '<img src="'+ card.image + '" alt="Avatar" style="width:10vw; height: 18vh;">'+
                                '</div>'+
                                '<div class="container col-xs-4 col-sm-7 col-md-7" style="padding-left: 40px !important;">'+

                                    '<h5><b>' + card.title +'</b></h5> '+
                                    '<h6>'+ card.description +'</h6>'+
                                    '<br>'+
                                    '<h6>'+ card.postText +'</h6> '+
                                '</div>'+
                                '<div class=" col-xs-7 col-sm-7 col-md-7"></div>'+
                            '</div>'+
                        '</div>';
                }
                control=control+'</div>';
                return control;
            },
            /** Neha **/
            /** Genereate HTML for a text **/
            getHtmlForText:function(data){
                control =  '<div class="direct-chat-msg" style="margin-bottom:2px !important;">';
                control = control + '<div>';
                // control = control + '<img class="direct-chat-img" src={{history.image}} alt="message user image">';
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
                        control = '<div class="row">';

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

            }



            /** Neha end **/
       }
    })
