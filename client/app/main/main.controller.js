'use strict';

angular.module('taskbarApp')
  .controller('Main', function ($scope, $interval, $timeout) {
    //var _ = require('lodash');
    //var path = require('path');
    var Q = require('q');
    var nachosApi = require('nachos-api');
    var client = nachosApi.server;
    var remote = require('remote');
    var windowz = remote.require('windowz');

    //var batteryLevel = require('battery-level');
    //var brightness = require('brightness');
    var vol = require('vol');

    $scope.date = Date.now();
    $interval(function () {
      $scope.date = Date.now();
    }, 1000);
/*
    $scope.windows = _.groupBy(windows.getAll(), function (window) {
      return window.process.name;
    });*/

    $scope.windows = windowz.getAll();
/*
    var checkBattery = function () {
      Q.nfcall(batteryLevel)
        .then(function (batteryLevel) {
          $scope.batteryLevel = batteryLevel;
          $scope.batteryLevelError = false;
        })
        .catch(function (err) {
          console.log(err);
          $scope.batteryLevelError = true;
        });
    };

    checkBattery();

    $interval(function () {
     checkBattery();
     }, 10000);

    var checkBrightness = function () {
      Q.nfcall(brightness.get)
        .then(function (bright) {
          $scope.brightness = bright;
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    checkBrightness();

    $interval(function () {
      checkBrightness();
    }, 300);

    $scope.setBrightness = function () {
      var jumps = 0.25;
      var calc = ((parseInt($scope.brightness / jumps) + 1) % (1 / jumps + 1)) * jumps;
      brightness.set(calc);
    };
*/
    var checkVolume = function () {
      Q.nfcall(vol.get)
        .then(function (volume) {
          $scope.volume = volume;
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    checkVolume();

    $interval(function () {
      checkVolume();
    }, 300);

    $scope.setVolume = function () {
      var jumps = 0.25;
      var calc = ((parseInt($scope.volume / jumps) + 1) % (1 / jumps + 1)) * jumps;
      vol.set(calc);
    };
/*
    workspaces.onWorkspacesChanged(function () {
      return updateWorkspaceMeta();
    });

    function updateWorkspaceMeta() {
      return workspaces.getWorkspacesMeta()
        .then(function (workspaces) {
          $scope.workspaces = workspaces;
        });
    }

    updateWorkspaceMeta();*/

    client.users.me()
      .then(function (user) {
        $scope.user = user;
      });
/*
    $scope.getNumberOfWindowsClass = function (window) {
      if (window.length > 9) {
        return 'mdi-numeric-9-plus-box-multiple-outline';
      }
      else if (window.length === 1) {
        return '';
      }
      else {
        return 'mdi-numeric-' + window.length + '-box-multiple-outline'
      }
    };*/
/*
    $scope.changeWorkspace = function (id) {
      workspaces.changeWorkspace(id);
    };
*/
    nachosApi.on('shell:editModeChanged', function (isEdit) {
      $timeout(function () {
        $scope.isEditMode = isEdit;
      });
    });

    $scope.toggleEditMode = function () {
      nachosApi.emit('shell:toggleEditMode');
    };

    $scope.windowClick = function (window) {
      windowz.activate(window.handle);
    };
  });
