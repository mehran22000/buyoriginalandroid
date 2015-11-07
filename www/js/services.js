angular.module('starter.services', [])

.factory('Cities', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var cities = [{
    id: 0,
    cityName: 'Tehran',
    areaCode: '021',
    cityNameFa:'تهران',   
    imageName: 'pics/tehran.png'
  }, {
    id: 1,
    cityName: 'Isfahan',
    areaCode: '031',
    cityNameFa:'اصفهان',   
    imageName: 'pics/isfahan.png'
  }, {
    id: 2,
    cityName: 'Kish',
    areaCode: '076',
    cityNameFa:'کیش',   
    imageName: 'pics/kish.png'
  }, {
    id: 3,
    cityName: 'Shiraz',
    areaCode: '071',
    cityNameFa:'شیراز',   
    imageName: 'pics/shiraz.png'
  }, {
    id: 4,
    cityName: 'Mashhad',
    areaCode: '051',
    cityNameFa:'مشهد',   
    imageName: 'pics/mashhad.png'
  }, {
    id: 5,
    cityName: 'Tabriz',
    areaCode: '041',
    cityNameFa:'تبریز',   
    imageName: 'pics/tabriz.png'
  }];
  
  return {
    all: function() {
      return cities;
    },
    remove: function(city) {
      cities.splice(cities.indexOf(city), 1);
    },
    get: function(cityId) {
      for (var i = 0; i < cities.length; i++) {
        if (cities[i].id === parseInt(cityId)) {
          return cities[i];
        }
      }
      return null;
    }
  };
});