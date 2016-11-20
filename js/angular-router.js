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
				url: 'https://quiet-crag-82048.herokuapp.com/disaster',
				params : {disaster: $scope.crisis.disaster}
			}).success(function(data)
			{
				totalNeeds = data; // response data 
				console.log(totalNeeds);
				$scope.$apply();
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
        if($scope.org.food){
        	var len = countyList.length;
        	for(var i =0;i<len;i++){
        		$scope.scopeServices.organizationName = 1;
        		$scope.scopeServices.county = countyList[i];
        		$scope.scopeServices.resourceType = "food";
        		$http({
          			method  : 'POST',
          			url     : 'https://quiet-crag-82048.herokuapp.com/services',
          			data    : $scope.scopeServices, //forms user object
          			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        		})
        	}
        }
      };

            var map;
            countyList = [];

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
        var justClicked = false;
        
        map.on("click", function(evt){    
          if(!justClicked){
           
          }
          justClicked = !justClicked
        })
        
        featureLayer.on("click", function(evt){       
          var t = "${County_Name}"
          map.graphics.clear();
          $scope.content = esriLang.substitute(evt.graphic.attributes,t);
          highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
          map.graphics.add(highlightGraphic);

		  var index = countyList.indexOf($scope.content);
          if (index > -1) {
    		countyList.splice(index, 1);
		  }
          else{
          	countyList.push($scope.content);
          }
          if(countyList){
          	arrayToString =countyList.join(", ");
          }
           $scope.$apply();
          console.log(arrayToString);
          hello = 1;
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
        $http({
          method  : 'POST',
          url     : 'https://quiet-crag-82048.herokuapp.com/verification',
          data    : $scope.volunteer, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      };
    });
