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


.controller('CategoryCtrl', function($scope, $http, $stateParams, StoreFetcher, CategoryFactory, $ionicLoading) {
 	console.log('cityAreaCode='+$stateParams.cityAreaCode);
 	
 	$scope.show = function() {
    	$ionicLoading.show({
      	template: '<p> ... بارگزاری</p><ion-spinner icon="lines"></ion-spinner>'
    		});
  	};

  	$scope.hide = function(){
        $ionicLoading.hide();
  	};
 	
 	$scope.show($ionicLoading);
 	StoreFetcher.all($stateParams.cityAreaCode)
        .success(function (data) { 
            $scope.stores = data;
 			$scope.categories = CategoryFactory.all($scope.stores);
    	}).error(function(data) {
      	    // Do something on error
        	var alertPopup = $ionicPopup.alert({
            title: 'خطا در بروز رسانی ',
            template: 'لطفا دوباره تلاش نمایید'
        	});
    	}).finally(function($ionicLoading) { 
      		// On both cases hide the loading
      		$scope.hide($ionicLoading);  
    	});
  
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

	function initialize() {
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

    ionic.Platform.ready(initialize);

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
})

.controller('NearMeCtrl', function($scope, $stateParams, StoreFetcher,StoreFactory, $ionicLoading) {
	var curLat = 0;
	var curLon = 0;
	$scope.distance = 1;
	
	$scope.show = function() {
    	$ionicLoading.show({
      	template: '<p> ... بارگزاری</p><ion-spinner icon="lines"></ion-spinner>'
    		});
  	};

  	$scope.hide = function(){
        $ionicLoading.hide();
  	};
 	
 	$scope.show($ionicLoading);

	navigator.geolocation.getCurrentPosition(function(pos) {
		// curLat = pos.coords.latitude;
		curLat = 32.654627;
		// curLon = pos.coords.longitude;
		curLon = 51.667983;
		$scope.updateStores(1);
		}, function(error) {
		  $scope.hide($ionicLoading);
          alert('Unable to get location: ' + error.message);
        });
        
    $scope.updateStores = function(dist) {
    	console.log('range value has changed to :'+dist);

    	StoreFactory.findNearmeStores(StoreFetcher,curLat,curLon,dist)
    	
    	.success(function (data) { 
			$scope.stores = data;
		}).error(function(data) {
      	    // Do something on error
        	var alertPopup = $ionicPopup.alert({
            title: 'خطا در بروز رسانی ',
            template: 'لطفا دوباره تلاش نمایید'
        	});
    	}).finally(function($ionicLoading) { 
      		// On both cases hide the loading
      		$scope.hide($ionicLoading);  
    	});
  	}
})

.controller('DealsCtrl', function($scope, $stateParams, StoreFetcher,StoreFactory, $ionicLoading) {
	var curLat = 0;
	var curLon = 0;
	$scope.distance = 5;
	
	$scope.show = function() {
    	$ionicLoading.show({
      	template: '<p> ... بارگزاری</p><ion-spinner icon="lines"></ion-spinner>'
    		});
  	};

  	$scope.hide = function(){
        $ionicLoading.hide();
  	};
	
	$scope.show($ionicLoading);
	navigator.geolocation.getCurrentPosition(function(pos) {
		
		// curLat = pos.coords.latitude;
		curLat = 35.808915;
		// curLon = pos.coords.longitude;
		curLon = 51.442341;
		$scope.updateStores(5);
		}, function(error) {
		  $scope.hide($ionicLoading);
          alert('Unable to get location: ' + error.message);
        });
        
    $scope.updateStores = function(dist) {
    	console.log('range value has changed to :'+dist);
    	StoreFactory.findDealsStores(StoreFetcher,curLat,curLon,dist)
    	
    	.success(function (data) { 
			$scope.stores = data;
		}).error(function(data) {
      	    // Do something on error
        	var alertPopup = $ionicPopup.alert({
            title: 'خطا در بروز رسانی ',
            template: 'لطفا دوباره تلاش نمایید'
        	});
    	}).finally(function($ionicLoading) { 
      		// On both cases hide the loading
      		$scope.hide($ionicLoading);  
    	});
  	}
})

.controller('NearmeStoreDetailsCtrl', function($scope, $stateParams, StoreFactory) {
 	$scope.nearStore = StoreFactory.getNearmeStore($stateParams.storeIndex);
 	console.log($scope.nearStore);
 })

.controller('DealsStoreDetailsCtrl', function($scope, $stateParams, StoreFactory) {
 	$scope.dealsStore = StoreFactory.getDealsStore($stateParams.storeIndex);
 	$scope.storeIndex = $stateParams.storeIndex;
 	console.log($scope.dealsStore);
 })
 
 .controller('DealsStoreNoteCtrl', function($scope, $stateParams, StoreFactory) {
 	$scope.dealsStore = StoreFactory.getDealsStore($stateParams.storeIndex);
 	console.log($scope.dealsStore);
 });
