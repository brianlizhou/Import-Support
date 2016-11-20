	var importSupport = angular.module('importSupport', ['ngRoute']);

	// configure our routes
	importSupport.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/org', {
				templateUrl : 'orgform.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/volunteer', {
				templateUrl : 'volunteerform.html',
				controller  : 'volunteerController'
			})

			.when('/donate', {
				templateUrl : 'donate.html',
				controller  : 'donateController'
			});
	});
	

	importSupport.controller('donateController', function($scope, $http)
{
$http({method: 'GET', url: 'js/test.json'}).success(function(data)
{
$scope.totalNeeds = data; // response data 
});
});