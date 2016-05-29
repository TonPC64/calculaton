/* global angular*/
angular.module('refidApp', [])
  .controller('regidCtrl', function ($scope, $http) {
    $http.get('/data').success(function (req, res) {
      $scope.data = req
    })

    $scope.addData = function (thing, ans) {
      $http.post('/data', {key: thing, ans: ans}).success(function (req, res) {
        $http.get('/data').success(function (req, res) {
          $scope.data = req
        })
      })
      $scope.thing = ''
      $scope.ans = ''
    }
  })
