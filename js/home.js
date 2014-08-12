
angular.module('waptruyen')


.service('appStore', ['$rootScope', '$collection', function($rootScope, $collection){
	var store = {};
	store['Categories'] = $collection.getInstance()
	store['Stories'] = $collection.getInstance()
	return store;
}])


.controller('homeCtrl', ['$scope', '$http','$rootScope','appStore', function($scope, $http, $rootScope, appStore){
	console.log('Home Controller', 'start', true);

	$scope.listCategory = [];
	$scope.listStories = [];
	$rootScope.pageTitle  = 'iTruyen';

	window.socketIo.on('connect:ok', function (data){
		console.log('connect ' + data.id);
	})

	window.socketIo.on('new:story', function (data){
		console.log('new:story');
		$http.get(window.apiHost + '/api/Stories/' + data.id).success( function(data){
			console.log('new:story', data);
			if(data.success){
				$scope.listStories.unshift(data.data);
				appStore.Stories.add(data.data);
			}
			
		});
	})


	var loadCategory = function (){

		$http.get(window.apiHost + '/api/Categories').success( function(data){
			if(data.success){
				$scope.listCategory = data.data;
				appStore.Categories.addAll(data.data);
			}
		});
	};


	var loadStories = function (){
		var sort = [{
			property: 'createAt',
			direction: 'DESC'
		}];
		$http.get(window.apiHost + '/api/Stories?sort='+ JSON.stringify(sort)).success( function(data){
			if(data.success){
				$scope.listStories = data.data;
				appStore.Stories.addAll(data.data);
			}
			
		});
	};


	if(appStore.Categories.size() > 0){
		$scope.listCategory = appStore.Categories.all();
		setTimeout(function (){
			loadCategory();
		}, 1000);
	}else {
		loadCategory();
	}


	if(appStore.Stories.size() > 0){
		$scope.listStories = appStore.Stories.all();
		setTimeout(function (){
			loadStories();
		}, 1000);
	}else {
		loadStories();
	}

	//loadCategory();
	//loadStories();
	
}])
.controller('detailCtrl', ['$scope', '$http', '$stateParams', '$rootScope', function($scope, $http, $stateParams, $rootScope){
	var storyId = $stateParams.storyId;
	$scope.storyItem = {};

	$http.get(window.apiHost + '/api/Stories/' + storyId).success( function(data){

			if(data.success){
				$rootScope.pageTitle = data.data.title
				$scope.storyItem = data.data;
			}
			
	});
}])

.controller('categoryCtrl', ['$scope', '$http', '$stateParams', '$rootScope', function($scope, $http, $stateParams, $rootScope){
	var categoryId = $stateParams.categoryId;
	$scope.categoryItem = [];
	var filter = [{
		property: 'categoryId',
		value: categoryId,
		type: 'string',
		comparison: 'eq'
	}];
	var sort = [{
			property: 'createAt',
			direction: 'DESC'
	}];


	$http.get(window.apiHost + '/api/Stories/?filter=' + JSON.stringify(filter) + '&sort=' + JSON.stringify(sort)).success( function(data){
			if(data.success){
				$scope.categoryItem = data.data;
			}
			
	});
}])

.controller('createCtrl', ['$scope', '$http','$rootScope','appStore', '$upload', function($scope, $http, $rootScope, appStore, $upload){
	console.log('createCtrl', 'start', true);

	$scope.story = {};


	var loadCategory = function (){
		console.log('loadCategory')
		$http.get(window.apiHost + '/api/Categories').success( function(data){
			if(data.success){
				$scope.listCategory = data.data;
				appStore.Categories.addAll(data.data);
			}
		});
	};



	if(appStore.Categories.size() > 0){
		$scope.listCategory = appStore.Categories.all();
		setTimeout(function (){
			loadCategory();
		}, 1000);
	}else {
		loadCategory();
	}

	$scope.createNewStory = function (story){
		$http.post(window.apiHost + '/api/Stories', story).success(function (resp){
			if(resp.success){
				window.socketIo.emit('new:story', {id: resp.data.id});
				$scope.story = {};
				alert('Dang bai thanh cong')

			}
			
		});
	}




	$scope.uploads = function ($files, story) {
		var files = $files;
	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        $scope.upload = $upload.upload({
	            url: 'http://vsoft.vn:1235/upload', // upload.php script, node.js route, or servlet url
	            method: 'POST', // or 'PUT',

	            file: file // or list of files: $files for html5 only

	        }).progress(function (evt) {
	            console.log(evt);
	        }).success(function (data, status, headers, config) {
	             console.info(data);
	             story.thumb = data.data.other.w60
	        });
	    }
	};



}]);

