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



.controller('FetcherCtrl', function($scope, $http, $stateParams, StoreFetcher, CategoryFactory, $ionicLoading, $timeout) {
 	console.log('FetcherCtrl='+$stateParams.cityAreaCode);
 	
 	$scope.adImageUrl = 'https://buyoriginal.herokuapp.com/images/ads/ad.'+$stateParams.cityAreaCode.toString()+'.png';
 	console.log($scope.adImageUrl);
 	
 	var isDataReady = false;
 	var isAdTimeEnough = false;
 	var isAdAvailable = false;
 	
 	// Spinner
    $scope.show = function() {
    	$ionicLoading.show({
      	template: '<p> ... بارگزاری</p><ion-spinner icon="lines"></ion-spinner>'
    		});
  	};

  	$scope.hide = function(){
        $ionicLoading.hide();
  	};
 	
 	$scope.imageExist = function imageExists(image_url){
    	var http = new XMLHttpRequest();
    	http.open('HEAD', image_url, false);
    	http.send();
		return http.status != 404;
	}
 	
 	// Pressing back button on category screen
 	if (CategoryFactory.isDataAvailable()) {
 		console.log('FetcherCtrl.back button pressed');
 		CategoryFactory.clearAll();
 		window.location.href = '#/search';
 		return;
 	}
 	
 	if ($scope.imageExist($scope.adImageUrl)) {
 		$scope.adHidden = false;
 		isAdAvailable = true;
 		console.log('ad exists');
 	}
 	else {
 		$scope.adHidden = true;
 		isAdAvailable = false;
 		console.log('ad does not exists');
 	}
 	
  	
  	$scope.show($ionicLoading);
 	
 	$timeout(function(){$scope.hide($ionicLoading);
 		isAdTimeEnough = true;
 		if ((isDataReady) && !(offline)){
 			console.log('isDataReady');
 			window.location.href = '#/tab/category/'+$stateParams.cityAreaCode;
 		}
 	}, 2000);
 	
 	// First try Offline Data
 	var offline = null;
  	if (localStorage.getItem($stateParams.cityAreaCode) !== null) {
  		offline = JSON.parse(window.localStorage[$stateParams.cityAreaCode] || '{}');
	}
  	 
 	if (offline) {
 		console.log('Offline Mode');
 		$scope.stores = offline;
		$scope.categories = CategoryFactory.all($scope.stores);
		CategoryFactory.setStores($scope.stores);
		isDataReady=true; 
 	}
 	
 	if ((isAdTimeEnough || !isAdAvailable) && (offline)) {
 		window.location.href = '#/tab/category/'+$stateParams.cityAreaCode;
 		$scope.hide($ionicLoading); 
 	}
 	
 	// Downloading data from database and saving them into local storage for the next time use
 	// First time use
 	StoreFetcher.all($stateParams.cityAreaCode)
       	.success(function (data) {
       		console.log('Data loaded'); 
            $scope.stores = data;
        	window.localStorage[$stateParams.cityAreaCode] = JSON.stringify(data);
 			$scope.categories = CategoryFactory.all($scope.stores);
 			CategoryFactory.setStores($scope.stores);

		}).error(function(data) {
    	 		
    	 	if ((isAdTimeEnough || !isAdAvailable) && (!offline)) {	
    	 		var alertPopup = $ionicPopup.alert({
        			title: 'خطا در بروز رسانی ',
        			template: 'لطفا دوباره تلاش نمایید'
        		});
        	}
    	
    	}).finally(function($ionicLoading) { 
      		// On both cases hide the loading
    		isDataReady = true;
 			if ((isAdTimeEnough || !isAdAvailable) && (!offline)) {
 				console.log('offline data not available');
 				window.location.href = '#/tab/category/'+$stateParams.cityAreaCode;
 				$scope.hide($ionicLoading); 
 			} 
    	});
})
    	
  
    


.controller('CategoryCtrl', function($scope, $http, $stateParams, StoreFetcher, CategoryFactory, $ionicLoading) {
 	console.log('cityAreaCode='+$stateParams.cityAreaCode);
 	
 	$scope.stores = CategoryFactory.getStores();
 	$scope.categories = CategoryFactory.getCategories();
    $scope.cityAreaCode = $stateParams.cityAreaCode;
  	
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
 
 
 
 .controller('CatAdCtrl', function($scope, $stateParams, $ionicLoading,$timeout,CategoryFactory, BrandFactory) {
 	console.log('CatAdCtrl='+$stateParams.catIndex);
 	console.log('CatAdCtrl='+$stateParams.cityAreaCode);
 	
 	var categories = CategoryFactory.getCategories();
 	var categoryName = categories[$stateParams.catIndex].nameEn;
 	
 	
 	$scope.adImageUrl = 'https://buyoriginal.herokuapp.com/images/ads/ad.'+$stateParams.cityAreaCode.toString()+'.'+categoryName+'.png';
 	console.log($scope.adImageUrl);
 	
 	
 	$scope.imageExist = function imageExists(image_url){
    	var http = new XMLHttpRequest();
    	http.open('HEAD', image_url, false);
    	http.send();
		return http.status != 404;
	};
 	
 	if (BrandFactory.isDataAvailable()){
 		console.log('CatAdCtrl.back button pressed');
 		BrandFactory.clearAll();
 		console.log('#/tab/category/'+$stateParams.cityAreaCode);
 		window.location.href = '#/tab/category/'+$stateParams.cityAreaCode;
 		return;
 	}

 	
 	$scope.show = function() {
    	$ionicLoading.show({
      	template: '<p> ... بارگزاری</p><ion-spinner icon="lines"></ion-spinner>'
    		});
  	};

  	$scope.hide = function(){
        $ionicLoading.hide();
  	};
  	
  	if ($scope.imageExist($scope.adImageUrl)) {
  		console.log('Category exists ');
 		$scope.show($ionicLoading);
 		$scope.adHidden = false;
 		$timeout(function(){$scope.hide($ionicLoading);
 				window.location.href = '#/tab/brands/'+$stateParams.catIndex.toString();
 			}, 2000);
 	}
 	else {
 		$scope.adHidden = true;
 		console.log('Category Ad does not exists ');
 		window.location.href = '#/tab/brands/'+$stateParams.catIndex.toString();
 	}
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
	
	function sortByKey(array, key) {
    	return array.sort(function(a, b) {
        	var x = a[key]; var y = b[key];
        		return ((parseFloat(x) < parseFloat(y)) ? -1 : ((parseFloat(x) > parseFloat(y)) ? 1 : 0));
    });
	}
	
	
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
		   curLat = pos.coords.latitude;
	    //   curLat = 32.654627;
	   	   curLon = pos.coords.longitude;
	   //    curLon = 51.667983;
		$scope.updateStores(1);
		}, function(error) {
		  $scope.hide($ionicLoading);
          alert('Unable to get location: ' + error.message);
        });
        
    $scope.updateStores = function(dist) {
    	console.log('range value has changed to :'+dist);

    	StoreFactory.findNearmeStores(StoreFetcher,curLat,curLon,dist)
    	
    	.success(function (data) { 
    		if (data.length > 0) {
				// $scope.stores = data;
				$scope.stores = sortByKey(data, 'distance');
			}
			else {
				$scope.errors = [{'error':'no_store_found'}];
			} 
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
	
	function sortByKey(array, key) {
    	return array.sort(function(a, b) {
        	var x = a[key]; var y = b[key];
        		return ((parseFloat(x) < parseFloat(y)) ? -1 : ((parseFloat(x) > parseFloat(y)) ? 1 : 0));
    });
	}
	
	
	$scope.show($ionicLoading);
	navigator.geolocation.getCurrentPosition(function(pos) {
		
		curLat = pos.coords.latitude;
	    // curLat = 35.808915;
		curLon = pos.coords.longitude;
		// curLon = 51.442341;
		$scope.updateStores(5);
		}, function(error) {
		  $scope.hide($ionicLoading);
          alert('Unable to get location: ' + error.message);
        });
        
    $scope.updateStores = function(dist) {
    	console.log('range value has changed to :'+dist);
    	StoreFactory.findDealsStores(StoreFetcher,curLat,curLon,dist)
    	
    	.success(function (data) { 
			if (data.length > 0) {
			//	$scope.stores = data;
				$scope.stores = sortByKey(data, 'distance');
			}
			else {
				$scope.errors = [{'error':'no_store_found'}];
			}
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
 
 .controller('AdCtrl', function($scope, $stateParams) {
 	console.log('AdCtrl');
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
