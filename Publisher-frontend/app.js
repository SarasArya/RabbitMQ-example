var app = angular.module('publisherApp', ['ui.router']);

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
    var socket = io.connect('http://localhost:3040');
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

        $scope.user = {
            topic: "",
            message: ""
        };

        // socket.on("receive", (data) => {
        //     console.log(data)
        // });  //this works!! strange

        $scope.submit = () => {
            console.log("Here");
            // socket.emit("publish", $scope.user); //somehow not working... huh
            //switching to REST
            console.log($scope.user);
            $http.post('http://localhost:3040/publish', $scope.user)
                .then(response => {
                    console.log(response);
                }, error => {
                    console.error(error);
                });
        }
    }

})();
