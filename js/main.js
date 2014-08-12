"use strict";
window.apiHost = 'http://chris-ictu.tk:8989';
window.socketIo = io.connect('http://chris-ictu.tk:8899');
window.mediaHost = 'http://vsoft.vn:1235'

angular.module('waptruyen', [
	'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.router',
    'ngCollection',
    'angularFileUpload'
])

.config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
	$stateProvider
		.state('app', {
			templateUrl: '/views/app.html',
			url: '',
			abstract: true
		})

		.state('app.home', {
			templateUrl: '/views/home.html',
			url: '/',
			controller: 'homeCtrl'
		})
		.state('app.category', {
			templateUrl: '/views/category.html',
			url: '/category/:categoryId',
			controller: 'categoryCtrl'
		})
		.state('app.detail', {
			templateUrl: '/views/detail.html',
			url: '/detail/:storyId',
			controller:'detailCtrl'
		})

		.state('app.createStory', {
			templateUrl: '/views/create.html',
			url: '/create',
			controller:'createCtrl'
		})

		;

	$urlRouterProvider.otherwise("/");
})
.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams){
	console.log('Application runing ...');
	/*
		Defined $rootScope model 
	*/

	$rootScope.mediaHost = window.mediaHost;
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.pageTitle = 'iTruyen';
}])
