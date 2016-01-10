angular.module('starter.services', [])

.factory('CityFactory', function() {

  var cityArray = 
  [{id: 0, cityName: 'Tehran', areaCode: '021', cityNameFa:'تهران', imageName: 'pics/tehran.png'}, 
  {id: 1, cityName: 'Isfahan',areaCode: '031',cityNameFa:'اصفهان', imageName: 'pics/isfahan.png'}, 
  {id: 2, cityName: 'Kish', areaCode: '076',cityNameFa:'کیش',   imageName: 'pics/kish.png'}, 
  {id: 3, cityName: 'Shiraz', areaCode: '071', cityNameFa:'شیراز',imageName: 'pics/shiraz.png'}, 
  {id: 4, cityName: 'Mashhad', areaCode: '051', cityNameFa:'مشهد', imageName: 'pics/mashhad.png'}, 
  {id: 5, cityName: 'Tabriz', areaCode: '041', cityNameFa:'تبریز', imageName: 'pics/tabriz.png'}];
  
   return {
    all: function() {
      return cityArray;
    },
    remove: function(city) {
      cityArray.splice(cities.indexOf(city), 1);
    },
    get: function(cityId) {
      for (var i = 0; i < cityArray.length; i++) {
        if (cityArray[i].id === parseInt(cityId)) {
          return cityArray[i];
        }
      }
      return null;
    }
  };
})

.factory('StoreFetcher', function ($http) { 
    return {
      all: function(areaCode){
         return $http({
            method: 'GET',
               url: 'https://buyoriginal.herokuapp.com/services/stores/storelist/city/'+areaCode.toString(),
            // url: 'http://localhost:5000/services/stores/storelist/city/'+areaCode.toString(),
            params: {}
         });
      },
      
      discounts: function(lat,lon,distance){
      	return $http({
            method: 'GET',
            url: 'https://buyoriginal.herokuapp.com/services/stores/storelist/discounts/'+lat.toString()+'/'+lon.toString()+'/'+ distance.toString(),
            params: {}
         });
      },
      
      nearme: function(brandId, lat,lon,distance){
      	return $http({
            method: 'GET',
            url: 'https://buyoriginal.herokuapp.com/services/stores/storelist/'+brandId.toString()+'/'+lat.toString()+'/'+lon.toString()+'/'+ distance.toString(),
            params: {}
         });
      }
    }
})

.factory('CategoryFactory', function() {
	
	var categories = [];
	var catStores = {};
	var stores = [];
	
	var availableCat = [{nameFa:'پوشاک بانوان',nameEn:'women_clothes'},{nameFa:'پوشاک',nameEn:'clothes'},{nameFa:'ساعت',nameEn:'watches'},{nameFa:'موبایل',nameEn:'cellphone'},
						{nameFa:'چرم',nameEn:'leather'},{nameFa:'پوشاک ورزشی',nameEn:'sports_clothes'},{nameFa:'کفش',nameEn:'shoes'},{nameFa:'آرایش و زیبایی',nameEn:'beauty'},
						{nameFa:'عطر و ادکلن',nameEn:'perfume'},{nameFa:'پوشاک آقایان',nameEn:'men_clothes'},{nameFa:'لوازم و پوشاک کودک',nameEn:'baby_clothes'},
						{nameFa:'لباس عروس',nameEn:'wedding'},{nameFa:'طلا و جواهر',nameEn:'jewelry'}];
						
    var getCategories = function(){
      return categories;
    };
	
	var getCatStores = function(){
      return catStores;
    };
    
    var setStores = function(allStores) {
       stores=allStores;
    };
    
    var getStores = function(){
    	return stores;
    };
    
    var isDataAvailable = function() {
    	if (stores.length>0) {
    		return true;	
    	}
    	else {
    		return false;
    	}
    };
    
    var clearAll = function() {
    	categories = [];
		catStores = {};
		stores = [];
    }
    
    var getNameEn = function(nameFa) {
    	var nameEn = 'general';
		angular.forEach(availableCat,function(cat,index){
			if (cat.nameFa===nameFa){
				nameEn =  cat.nameEn;
				}
			});
		return nameEn;
	};
       
	return {
		all: function (stores) {
			var catCounter = 0;
			catStores = {};
			categories = [];
			for(var i=0;i<stores.length;i++){
        		var obj = stores[i];
        		var category = obj.bCategory;
        		if (catStores[category]== null){
        			catStores[category] = [obj];
        			var nameEn = getNameEn(category);
        			categories.push({'name':category,'index':catCounter,'nameEn':nameEn});
        			catCounter = catCounter + 1;	
        		}
        		else {
        			temp = catStores[category];
					temp.push(obj);        		
        			catStores[category]=temp;
        		}
    		}
    		return categories;
		},
		getCatStores:getCatStores,
		getCategories:getCategories,
		getStores:getStores,
		setStores:setStores,
		isDataAvailable:isDataAvailable,
		clearAll:clearAll
	}	
})


.factory('BrandFactory', function() {
	
    var brands = [];
    var brandStores = {};
    
    var getBrandStores = function(){
      return brandStores;
    };
    
    var getBrands = function(){
      return brands;
    };
    
    var isDataAvailable = function() {
    	if (brands.length>0) {
    		return true;	
    	}
    	else {
    		return false;
    	}
    };
    
    var clearAll = function() {
    	brands = [];
    	brandStores = {};
    };

    return {
		all: function (allStores) {
			var brandCounter = 0;
			brandStores = {};
			brands = [];
      		for(var i=0;i<allStores.length;i++){
        		var store = allStores[i];
        		var brand = store.bName;
        		if (brandStores[brand]== null){
        			brandStores[brand] = [store];
        			brands.push({'name':brand,'index':brandCounter});
        			brandCounter = brandCounter + 1;	
        		}
        		else {
        			temp = brandStores[brand];
					temp.push(store);        		
        			brandStores[brand]=temp;
        		}
    		}
       return brands;
    },
    
    getBrands: getBrands,
    getBrandStores: getBrandStores,
    isDataAvailable: isDataAvailable,
    clearAll:clearAll
    }	
})


.factory('StoreFactory', function() {
	
	var nearmeStores = [];
	var dealsStores = [];	
	var getStores = function(BrandFactory, brandId){
	    var brands = BrandFactory.getBrands();
	    var brandName = brands[brandId].name;
	    var stores = BrandFactory.getBrandStores();
	    return stores[brandName];
    };
    
    return {
    	findNearmeStores: function (StoreFetcher,lat,lon,dist) {
    		return StoreFetcher.nearme('all',lat.toString(),lon.toString(),dist.toString()).success(function (data) { 
            	nearmeStores = data;
 	 			}
    		);
    	},
    	findDealsStores: function (StoreFetcher,lat,lon,dist) {
    		return StoreFetcher.discounts(lat.toString(),lon.toString(),dist.toString()).success(function (data) { 
            	dealsStores = data;
 	 			}
    		);
    	},
    	getNearmeStore: function (index) {
    		return nearmeStores[index];
    	},
    	getDealsStore: function (index) {
    		return dealsStores[index];
    	},
    	getStores: getStores
    }	
});


