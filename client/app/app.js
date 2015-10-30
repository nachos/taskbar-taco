'use strict';
angular.module('taskbarApp', ['ngMaterial', 'angularMoment'])
  .run(function () {

  })
  .config(function($mdThemingProvider){
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('lime');
  });