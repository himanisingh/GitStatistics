var app = angular.module('gitStats', []);

// Directive for generic chart, pass in chart options
app.directive('hcChart', function () {
    return {
			restrict: 'E',
			template: '<div></div>',
			scope: {
				options: '='
			},
			link: function (scope, element) {
				Highcharts.chart(element[0], scope.options);
			}
		};
	});
	
app.controller('GitStatsCtrl', ['$scope','$http', function($scope,$http) {

	$scope.username = '';
	$scope.repo = {};
	$scope.repos = [];
	$scope.lineChartXData = [];
	$scope.lineChartYData = [];

	var baseUrl = 'https://api.github.com/';

	$scope.getRepos = function(){
		$http({
		method: 'GET',
		url: baseUrl + 'users/' + $scope.username + '/repos',
		}).then(function successCallback(response) {    
				$scope.repoData = response.data;			
				 _.each($scope.repoData, function(item) {	
					$scope.getCommitCount(item.name);						
				}); 
		}, function errorCallback(response) {
			
		});
	};

	$scope.getCommitCount = function(name){	
		$http({
		method: 'GET',
		url: baseUrl + 'repos/' + $scope.username + '/' + name + '/stats/commit_activity',
		}).then(function successCallback(response) { 			
				var arr = _.pluck(response.data, 'total');		
				var count = _.reduce(arr, function(memo, num){ return memo + num; }, 0);					
				$scope.lineChartXData.push(name);
				$scope.lineChartYData.push(count);	
				if($scope.repoData.length === $scope.lineChartXData.length){
					$scope.chartOptions.xAxis.categories = $scope.lineChartXData;
					$scope.chartOptions.series[0] = $scope.lineChartYData;
					new Highcharts.chart($scope.chartOptions);	
				}	
		}, function errorCallback(response) {
			
		});
	};

	$scope.getCommits = function(name){
		$scope.repo.name = name;
		$http({
		method: 'GET',
		url: baseUrl + 'repos/' + $scope.username + '/' + name + '/commits',
		}).then(function successCallback(response) {    
				$scope.repo.commitData = response.data;			
		}, function errorCallback(response) {
			console.log(response);
		});
	};	
	
	if($scope.lineChartXData && $scope.lineChartYData){
		$scope.chartOptions = {
			title: {
				text: 'Repository Commit data'
			},
			xAxis: {
				categories: []
			},

			series: [{
				data: []
			}]
		}; 
	}
	
	/*  $scope.chartOptions = {
		title: {
			text: 'Temperature data'
		},
		xAxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		},

		series: [{
			data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
		}]
	}; */

	
}]);



