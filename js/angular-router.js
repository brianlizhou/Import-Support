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
	
	
	importSupport.controller('mainController', function($scope, $http){
		$scope.submitForm = function() {
			$http({
				method: 'GET', 
				url: 'https://quiet-crag-82048.herokuapp.com/disaster_names',
				//params : {disaster: $scope.crisis.disaster}
			}).success(function(data)
			{
				$scope.totalNeeds = data; // response data 
				console.log(data);
			});
		}
	});

	importSupport.controller('donateController', function($scope){});

	importSupport.controller('orgController', function($scope, $http){
		$scope.submitForm = function() {
        $http({
          method  : 'POST',
          url     : 'https://quiet-crag-82048.herokuapp.com/organizations',
          data    : $scope.org, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      };
	});

	// create the controller and inject Angular's $scope
	importSupport.controller('volunteerController', function($scope, $http) {
      // calling our submit function.
      $scope.submitForm = function() {
        $http({
          method  : 'POST',
          url     : 'https://quiet-crag-82048.herokuapp.com/verification',
          data    : $scope.volunteer, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      };
    });
