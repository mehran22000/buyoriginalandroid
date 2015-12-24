// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
   .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'CityCtrl'
        }
      }
    })
    
   .state('tab.search-category', {
      url: '/category/:cityAreaCode',
      views: {
        'tab-search': {
          templateUrl: 'templates/category-list.html',
          controller: 'CategoryCtrl'
        }
      }
   })
   
   .state('tab.search-brand', {
      url: '/brands/:catIndex',
      views: {
        'tab-search': {
          templateUrl: 'templates/brand-list.html',
          controller: 'BrandCtrl'
        }
      }
   })
   
   .state('tab.search-store', {
      url: '/stores/:brandIndex',
      views: {
        'tab-search': {
          templateUrl: 'templates/store-list.html',
          controller: 'StoreCtrl'
        }
      }
   })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  
  
  .state('tab.search-store-location', {
      url: '/stores/map/:lat/:lon',
      views: {
        'tab-search': {
          templateUrl: 'templates/store-map.html',
          controller: 'MapCtrl'
        }
      }
   })
  ;
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/search');

});

