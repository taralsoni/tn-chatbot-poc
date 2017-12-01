app.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

  app.directive('compile', ['$compile', function ($compile) {
      return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
   )};
  }])

app.directive('resize', function ($window) {
  return function (scope) {
      scope.width = $window.innerWidth;
      scope.height = $window.innerHeight;
      angular.element($window).bind('resize', function () {
          scope.$apply(function () {
              scope.width = $window.innerWidth;
              scope.height = $window.innerHeight;
          });
      });

      };
  })

app.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(attrs.lat, attrs.long),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }    
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();

        //console.log(JSON.parse(attrs.marker));
        var markersData=JSON.parse(attrs.marker);
        
        for(var i=0;i<markersData.length;i++){
          setMarker(map, new google.maps.LatLng(markersData[i].latitude,markersData[i].longitude), markersData[i].name, markersData[i].vicinity);
        }
        //setMarker(map, new google.maps.LatLng(attrs.lat,attrs.long), attrs.title, attrs.desc);
        
        
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps" ></div>',
        replace: true,
        link: link
    };
})