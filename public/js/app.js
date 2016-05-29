/* global angular,confirm*/
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

    $scope.editData = function (thing, ans, newkey) {
      console.log({key: thing, ans: ans, newkey: newkey})
      $http.post('/data/edit', {key: thing, ans: ans, newkey: newkey}).success(function (req, res) {
        $http.get('/data').success(function (req, res) {
          $scope.data = req
          $scope.editkey = ''
        })
      })

    }

    $scope.deleteData = function (key) {
      var con = confirm('ยืนยันการลบ')
      if (con) {
        $http.post('/data/delete', {key: key}).success(function (req, res) {
          $http.get('/data').success(function (req, res) {
            $scope.data = req
          })
        })
      }
    }

    $scope.editbutkey = function (index, key) {
      $scope.oldkey = key
      $scope.editkey = index
    }
    $scope.cancel = function () {
      $scope.editkey = ''
    }
  })
