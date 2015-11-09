angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('SearchCtrl', function($scope, Cities) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.cities = Cities.all();
  $scope.remove = function(city) {
    Cities.remove(city);
  };  
})


.controller('CategoryListCtrl', function($scope, $http, $stateParams) {
 
  console.log('URL', 'https://aslbekhar.herokuapp.com/stores/storelist/city/'+ $stateParams.cityAreaCode);
  $http.get('https://aslbekhar.herokuapp.com/stores/storelist/city/'+$stateParams.cityAreaCode).then(function(resp) {
    console.log('Success', resp);
    $scope.stores = resp.data;
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
})



.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
