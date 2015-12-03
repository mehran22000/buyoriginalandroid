angular.module('starter.controllers', [])

// .controller('DashCtrl', function($scope) {})

.controller('CityCtrl', function($scope, CityFactory) {
  
  $scope.cities = CityFactory.all();
  
  $scope.filter = function (search) {
      console.log('CityCtrl.filter');
      console.log('keyword'+search);
      
      var allCities = CityFactory.all();
      var filteredCities = [];
      
      angular.forEach(allCities,function(city,index){
                var cityNameEn = angular.lowercase(city.cityName);
                var cityNameFa = city.cityNameFa;
                
                if ((cityNameEn.indexOf(search) !== -1) ||
                    (cityNameFa.indexOf(search) !== -1)) {
                	filteredCities.push(city);
                }
            })
        $scope.cities=filteredCities;
  	}
})


.controller('CategoryCtrl', function($scope, $http, $stateParams, StoreFetcher, CategoryFactory) {
 	console.log('cityAreaCode='+$stateParams.cityAreaCode);
 	
 	StoreFetcher.all($stateParams.cityAreaCode)
        .success(function (data) { 
            $scope.stores = data;
 			$scope.categories = CategoryFactory.all($scope.stores);
    	}
    );
    
    $scope.filter = function (search) {
      console.log(search);
      var allCategories = CategoryFactory.getCategories();
      var filteredCategories = [];
      angular.forEach(allCategories,function(cat,index){
                if (cat.name.indexOf(search) !== -1)  {
                	filteredCategories.push(cat);
                }
            })
        $scope.categories=filteredCategories;
  	};
 })
 
 
 .controller('BrandCtrl', function($scope, $stateParams, CategoryFactory, BrandFactory) {
 	console.log('category='+$stateParams.catIndex);
 
 	var categories = CategoryFactory.getCategories();
 	var categoryName = categories[$stateParams.catIndex].name; 	
 	var catStores = CategoryFactory.getCatStores();
 	var categoryStores = catStores[categoryName];
 	$scope.brands = BrandFactory.all(categoryStores);
	$scope.allBrands = $scope.brands;
	
	$scope.filter = function (search) {
      console.log(search);
      var filteredBrands = [];
      angular.forEach($scope.allBrands,function(brand,index){
                var brandName=angular.lowercase(brand.name);
                if (brandName.indexOf(search) !== -1)  {
                	filteredBrands.push(brand);
                }
            })
        $scope.brands=filteredBrands;
  	};
	
	
 })


.controller('StoreCtrl', function($scope, $stateParams, BrandFactory, StoreFactory) {
 	$scope.stores = StoreFactory.getStores(BrandFactory,$stateParams.brandIndex);
 })


.controller('MapCtrl', function($scope, $ionicLoading, $compile, $stateParams) {

    $scope.init = function() {
        var myLatlng = new google.maps.LatLng($stateParams.lat,$stateParams.lon);

        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
    };

    // google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };
})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
