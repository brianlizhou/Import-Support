	var importSupport = angular.module('importSupport', ['ngRoute']);

	// configure our routes
	importSupport.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'home.html',
				controller  : 'mainController'
			})

			// route for the donate page
			.when('/donate', {
				templateUrl : 'donate.html',
				controller  : 'donateController'
			})

			// route for the organization page
			.when('/organization', {
				templateUrl : 'orgform.html',
				controller  : 'orgController'
			})

			// route for the volunteer page
			.when('/volunteer', {
				templateUrl : 'volunteerform.html',
				controller  : 'volunteerController'
			});
	});
	
	
	importSupport.controller('mainController', function($scope){});

	importSupport.controller('donateController', function($scope, $http)
	{
		$http({method: 'GET', url: 'js/test.json'}).success(function(data)
		{
			$scope.totalNeeds = data; // response data 
		});
	});

	importSupport.controller('orgController');

	// create the controller and inject Angular's $scope
	importSupport.controller('volunteerController', function($scope, $http) {
      // calling our submit function.
      $scope.submitForm = function() {
        $http({
          method  : 'POST',
          url     : 'js/posts.json',
          data    : $scope.user, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      };
    });
