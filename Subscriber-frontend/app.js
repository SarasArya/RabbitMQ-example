const app = angular.module('SubscriberApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

    /*CORS*/
    // $httpProvider.defaults.withCredentials = true;
    // $httpProvider.defaults.useXDomain = true;

    $stateProvider
        .state('initial', {
            url: "/initial",
            templateUrl: 'views/initial.html',
            controller: 'PublisherCntrl'
        });

    $urlRouterProvider.otherwise('/initial');

});
app.factory('socket', function($rootScope) {
    var socket = io.connect('http://localhost:3060');
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});

(() => {
    app.controller('PublisherCntrl', PublisherCntrl);
    PublisherCntrl.$inject = ['socket', '$scope', '$http'];

    function PublisherCntrl(socket, $scope, $http) {
        $scope.topics = ["Cricket", "Football", "Golf", "Tennis", "Badminton"];

        $scope.selectedTopics = [];
        $scope.user = {
            topic: "",
            message: ""
        };
        $scope.message = {
            Cricket: [],
            Football: [],
            Golf: [],
            Tennis: [],
            Badminton: []
        };
        $scope.submit = () => {
            for (let i = 0; i < $scope.selectedTopics.length; i++) {
                console.log(`${$scope.selectedTopics[i]} socket created` );
                socket.on(`${$scope.selectedTopics[i]}`, (data) => {
                    console.log(data);
                    $scope.message[`${$scope.selectedTopics[i]}`].push(data.messages);
                });
            }
        }
    }

})();
