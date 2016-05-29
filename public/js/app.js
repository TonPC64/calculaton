/* global angular*/
angular.module('refidApp', [])
  .controller('regidCtrl', function ($scope, $http) {
    $http.get('/data').success(function (req, res) {
      $scope.data = req
    })

    $scope.addData = function (thing, amount, unit) {
      $http.post('/data', {key: thing,amount: amount,unit: unit}).success(function (req, res) {
        $http.get('/data').success(function (req, res) {
          $scope.data = req
        })
      })
      $scope.thing = ''
      $scope.amount = ''
      $scope.unit = ''
    }
  })
