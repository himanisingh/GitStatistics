var app = angular.module('gitStats', []);


// Directive for generic chart, pass in chart options
app.directive('hcChart', function () {
    return {
			restrict: 'E',
			template: '<div></div>',
			scope: {
				options: '='
			},
			link: function (scope, element, attrs) {
				 scope.$watch('chartOptions', function() {
					Highcharts.chart(element[0], scope.options);
				});
								
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
					$scope.chartOptions.series[0].data = $scope.lineChartYData;							
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
	
	/* $scope.chartOptions = {		
		title: {
			text: 'Repository Commit data'
		},
		xAxis: {
			categories: $scope.lineChartXData
		},

		series: [{
			data: $scope.lineChartYData
		}]
	}; 	 */
	
	  $scope.chartOptions = {
		title: {
			text: 'Repository Commit data'
		},
		xAxis: {			
            title: {
                enabled: true,
                text: 'Repository',
                style: {
                    fontWeight: 'normal'
				}	
             }, 
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		},		
        yAxis: {
            title: {
                enabled: true,
                text: 'Commit',
                style: {
                    fontWeight: 'normal'
                }
            }
        },	
		series: [{
			data: [11, 27, 6, 2, 31, 9, 43]
		}]
	}; 
	
}]);


