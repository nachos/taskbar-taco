'use strict';
angular.module('taskbarApp', ['ngMaterial', 'angularMoment'])
  .config(function($mdThemingProvider){
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('lime');
  });