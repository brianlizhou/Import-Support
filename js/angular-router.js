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
			})

			.when('/donationGeneral', {
				templateUrl : 'donateMoney.html',
				controller  : 'donateMoneyController'
			})

      // route for the donate to supplies page
      .when('/donateToSupplies', {
        templateUrl : 'donateToSupplies.html',
        controller  : 'donateToSuppliesController'
      })

      // route for the donate to supplies page
      .when('/donatePayment', {
        templateUrl : 'donationPayment.html',
        controller  : 'paymentController'
      })

      // route for the donate supplies page
      .when('/donateSupplies', {
        templateUrl : 'donateSupplies.html',
        controller  : 'donateSuppliesController'
      });
	});
	
	var totalNeeds;
  var disasterType;
	importSupport.controller('mainController', function($scope, $http){
		$scope.submitForm = function() {
			$http({
				method: 'GET', 
				url: 'https://quiet-crag-82048.herokuapp.com/disaster',
				params : {disaster: $scope.crisis.disaster}
			}).success(function(data)
			{
				disasterType = $scope.crisis.disaster;
        		console.log("DisasterType from Main: " + disasterType);
				totalNeeds = data; // response data 
				console.log(totalNeeds);
			});

		}
	});

	importSupport.controller('donateController', function($scope, $timeout){
		$scope.localNeeds = totalNeeds;
    	$scope.localDisaster = disasterType;
    		// $scope.$apply();
    		$scope.localDisaster = "Hurricane Matthew";
    		console.log($scope.localDisaster);

		$scope.submitForm = function() {
			$http({
				method: 'GET', 
				url: 'https://quiet-crag-82048.herokuapp.com/county_contributions',
				params : {country: "egg"}
			}).success(function(data)
			{
       			$scope.orgList = data;
			});
		}

	});


	var arrayToString;
    var countyList = [];

	importSupport.controller('orgController', function($scope, $http){
	  $scope.submitForm = function() {
        $http({
          method  : 'POST',
          url     : 'https://quiet-crag-82048.herokuapp.com/organizations',
          data    : $scope.org, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        if($scope.org.food){
        	var len = countyList.length;
        	var scopeServices = {};
        	for(var i =0;i<len;i++){
        		scopeServices.organizationName = $scope.org.organizationName;
        		scopeServices.county = countyList[i];
        		scopeServices.resourceType = "food";
        		$http({
          			method  : 'POST',
          			url     : 'https://quiet-crag-82048.herokuapp.com/services',
          			data    : scopeServices, //forms user object
          			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        		})
        	}
        }
      };

            var map;

      require([
        "esri/map", "esri/layers/FeatureLayer",
        "esri/InfoTemplate", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/renderers/ClassBreaksRenderer", "esri/graphic", "esri/lang",
        "esri/Color", "dojo/dom-style", "dojo/domReady!"
      ], function(
        Map, FeatureLayer,
        InfoTemplate, SimpleFillSymbol, SimpleLineSymbol,
        ClassBreaksRenderer, Graphic, esriLang,
        Color, domStyle
      ) {
        map = new Map("map", {
          basemap: "streets",
          center: [-83.54, 27.646],
          zoom: 6,
          slider: false
        });

        var symbol = new SimpleFillSymbol();
        symbol.setColor(new Color([150, 150, 150, 0.5]));
    
        
        var highlightSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 3
          ),
          new Color([125,125,125,0.35])
        );
        
        var hoverSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 3
          ),
          new Color([153,50,204,0.35])
        );

        // Add five breaks to the renderer.
        // If you have ESRI's ArcMap available, this can be a good way to determine break values.
        // You can also copy the RGB values from the color schemes ArcMap applies, or use colors
        // from a site like www.colorbrewer.org
        //
        // alternatively, ArcGIS Server's generate renderer task could be used
        var renderer = new ClassBreaksRenderer(symbol, "Resources_Needs_Statisfied");
        renderer.addBreak(1, 25, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 0.5])));
        renderer.addBreak(25, 75, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 0.5])));
        renderer.addBreak(75, Infinity, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));

        //var infoTemplate = new InfoTemplate("${County_Name}", "${*}");
       
        var featureLayer = new FeatureLayer("https://services7.arcgis.com/vGwGOHEhgdNFiYyz/arcgis/rest/services/US_County_Resources_Needed/FeatureServer/0", {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"],
          //infoTemplate: infoTemplate
        });
        var highlightGraphic;
        
        featureLayer.on("click", function(evt){       
          var t = "${County_Name}"
          
          var content = new String(esriLang.substitute(evt.graphic.attributes,t));
          highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
          map.graphics.add(highlightGraphic);

		  var index = countyList.indexOf(content);
          if (index > -1) {
    		countyList.splice(index, 1);
		  }
          else{
          	countyList.push(content);
          }
          if(countyList){
          	arrayToString =countyList.join(", ");
          	$scope.arrayToString = arrayToString;
          }
          var temp = "Counties selected: ";
          var len = countyList.length;
        	for(var i =0;i<len;i++){
        		temp += countyList[i]+", ";
        	}
          document.getElementById("county").innerHTML = temp;
          console.log(arrayToString);
        });

        document.getElementById("clearButton").addEventListener('click', function (event) {
          map.graphics.clear();
          document.getElementById("county").innerHTML = "Counties selected: ";
        });
        

        


        featureLayer.setRenderer(renderer);
        map.addLayer(featureLayer);

      });

      //$scope.updateData = function()

	});

	// create the controller and inject Angular's $scope
	importSupport.controller('volunteerController', function($scope, $http) {
      // calling our submit function.
      $scope.submitForm = function() {
      var originalValue;

    $http({
        method: 'GET', 
        url: 'https://quiet-crag-82048.herokuapp.com/org_single_contribution',
        params : {organization: $scope.volunteer.organizationName,county:$scope.volunteer.county,resource:$scope.volunteer.resourceType}
      }).success(function(data)
      {
        originalValue = data.providedResource; // response data 
        console.log(data);
        var number = parseInt($scope.volunteer.quantity) + originalValue;  
        $scope.volunteer.quantity = parseInt(number);
              console.log($scope.volunteer);

              $http({
          method  : 'POST',
          url     : 'https://quiet-crag-82048.herokuapp.com/verification',
          data    : $scope.volunteer, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      });



        
      };
    });

	var donationAmt;
     // create the controller and inject Angular's $scope
  importSupport.controller('donateMoneyController', function($scope, $http) {
      // calling our submit function.
      $scope.submitForm = function() {
        donationAmt = $scope.donation.amount;
      };
    });

   importSupport.controller('paymentController', function($scope, $http) {
      // calling our submit function.
      $scope.submitForm = function() {
        $scope.donation.amount = donationAmt;
      };
    });

  // create the controller and inject Angular's $scope
  importSupport.controller('donateToSuppliesController', function($scope, $http) {
      // calling our submit function.
      $scope.submitForm = function() {
        $http({
          method  : 'POST',
          url     : 'https://quiet-crag-82048.herokuapp.com/verification',
          data    : $scope.donate, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      };
    });

  // create the controller and inject Angular's $scope
  importSupport.controller('donateSuppliesController', function($scope, $http) {
      // calling our submit function.
      $scope.submitForm = function() {
        $http({
          method  : 'POST',
          url     : 'https://quiet-crag-82048.herokuapp.com/verification',
          data    : $scope.donate, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      };
    });
