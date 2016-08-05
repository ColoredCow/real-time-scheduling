var app = angular.module('rts', ['ui.router', 'ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {

    // $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "/app/templates/login.html",
            controller: "logincontroller"
        })
        .state("register", {
            url: "/register",
            templateUrl: "/app/templates/register.html",
            controller: "registercontroller"
        })
        .state("user", {
            url: "/user",
            resolve: {
                authorize: function(authorization) {
                    return authorization.hasAuth();
                }
            },
            templateUrl: "/app/templates/user.html",
            controller: "usercontroller"
        })
        .state("user.timeslots", {
            templateUrl: "/app/templates/user.timeslots.html"
        })
        .state("schedule", {
            url: "/schedule",
            templateUrl: "/app/templates/schedule.html",
            controller: "schedulecontroller"
        });
});

app.run(function($cookies, $state) {
    if ($cookies.get('activeuser'))
        $state.go("user");
    console.log($cookies.get('activeuser'));
});

app.factory('authorization', function($q, $state, $cookies) {
    return {
        hasAuth: function() {
            var showauth = $q.defer();
            if ($cookies.get('activeuser'))
                showauth.resolve("Access granted");
            else {
                showauth.reject("Access denied");
            }
            return showauth.promise;
        }
    };
});

app.factory('socket', function() {
    var socket = io.connect();
    socket.on('message', function(message) {
        console.log("message received from server:",message)
    });
    return {
        on: function (eventName, callback) {
            socket.on(eventName, callback);
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, callback); 
        },
        send: function(data) {
            socket.send(data);
        }
    };
});
