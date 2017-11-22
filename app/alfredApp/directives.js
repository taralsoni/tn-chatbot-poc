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
  });