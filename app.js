'use strict';
var app = angular.module('myApp', ['facebook']); // inject facebook module

app.config(['FacebookProvider', function(FacebookProvider) {
     // Here you could set your appId through the setAppId method and then initialize
     // or use the shortcut in the initialize method directly.
     FacebookProvider.init('213438082188010');
}])

app.controller('authenticationCtrl', ['$scope', 'Facebook', function($scope, Facebook) {

  // Here, usually you should watch for when Facebook is ready and loaded
  $scope.$watch(function() {
    return Facebook.isReady(); // This is for convenience, to notify if Facebook is loaded and ready to go.
  }, function(newVal) {
    $scope.facebookReady = true; // You might want to use this to disable/show/hide buttons and else
  });

  // From now on you can use the Facebook service just as Facebook api says
  // Take into account that you will need $scope.$apply when inside a Facebook function's scope and not angular
  $scope.login = function() {
    Facebook.login(function(response) {
      // Do something with response. Don't forget here you are on Facebook scope so use $scope.$apply
    });
  };

  $scope.status = function() {
  Facebook.getLoginStatus(function(response) {
   
    if (response.status === 'connected') {
      // the user is logged in and has authenticated your
      // app, and response.authResponse supplies
      // the user's ID, a valid access token, a signed
      // request, and the time the access token 
      // and signed request each expire
      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
    } else if (response.status === 'not_authorized') {
      // the user is logged in to Facebook, 
      // but has not authenticated your app
    } else {
      // the user isn't logged in to Facebook.
    }
   });
  };

  $scope.getFeed = function() {
     Facebook.login(function(){}, {scope: 'email'});
  $scope.showLoading =true;
   Facebook.login(function(){
      Facebook.api('/me', function(response) {
          $scope.user=response;
      });
      Facebook.api('/231120563712448/feed?limit=500', function(response) {
          $scope.groupFeed=response;
          $scope.showLoading =false;
          console.dir ($scope.groupFeed);
 
          var postCount = {};
          response.data.forEach(function(entryFB) {
              var name=entryFB.from.name;
              postCount.hasOwnProperty(name)?
              postCount[name].count++:
              postCount[name] = {name:name,count:1};
          }); 

          var postCountArr = [];
          angular.forEach(postCount, function(value, key){
            this.push({'count':value.count,'name':key});
          }, postCountArr);
          $scope.postCountArr =postCountArr;


      });
  
    }, {scope: 'email'});
  };

  $scope.getFeed();
  
}]);