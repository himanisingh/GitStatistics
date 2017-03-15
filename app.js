var app = angular.module('gitStats', []);
app.controller('GitStatsCtrl', ['$scope','$http', function($scope,$http) {

$scope.getRepo = function(){
	$http({
	method: 'GET',
	url: 'https://api.github.com/users/'+$scope.username+'/repos',
	}).then(function successCallback(response) {    
			$scope.repoData = response.data;
	}, function errorCallback(response) {
		console.log(response);
	});
};

		
}]);


