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
            url: 'https://aslbekhar.herokuapp.com/stores/storelist/city/'+areaCode.toString(),
            params: {}
         });
      }
    }
})

.factory('CategoryFactory', function() {
	
	var categories = [];
	var catStores = {};
	var availableCat = [{nameFa:'پوشاک بانوان',nameEn:'dress_women'},{nameFa:'پوشاک',nameEn:'dress'},{nameFa:'ساعت',nameEn:'watch'},{nameFa:'موبایل',nameEn:'mobile'},
						{nameFa:'چرم',nameEn:'leather'},{nameFa:'پوشاک ورزشی',nameEn:'dress_sport'},{nameFa:'کفش',nameEn:'shoes'},{nameFa:'آرایش و زیبایی',nameEn:'makeup'},
						{nameFa:'عطر و ادکلن',nameEn:'perfume'},{nameFa:'پوشاک آقایان',nameEn:'dress_men'},{nameFa:'لوازم و پوشاک کودک',nameEn:'baby'},
						{nameFa:'لباس عروس',nameEn:'wedding'}];
						
    var getCategories = function(){
      return categories;
    };
	
	var getCatStores = function(){
      return catStores;
    };
    
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
		getCategories:getCategories
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
    getBrandStores: getBrandStores
    }	
})


.factory('StoreFactory', function() {
		
	var getStores = function(BrandFactory, brandId){
	    var brands = BrandFactory.getBrands();
	    var brandName = brands[brandId].name;
	    var stores = BrandFactory.getBrandStores();
	    return stores[brandName];
    };
    
    return {
    	getStores: getStores
    }	
})







;


