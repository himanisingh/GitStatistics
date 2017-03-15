var app = angular.module('gitStats', []);

app.controller('GitStatsCtrl', function($scope){

	$scope.getRepo = function(){
		console.log($scope.username);
	};

});


