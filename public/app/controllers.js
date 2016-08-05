app.controller('logincontroller', function($scope, $http, $state, $cookies) {

    $scope.company = "coloredcow";

    $scope.login = function() {
        if ($scope.userstr && $scope.passstr) {
            var userdata = {
                'username': $scope.userstr,
                'password': $scope.passstr
            };
            $http.post('/post-login', userdata)
                .then(function(response) {
                    let tempvar = response.data;
                    if (tempvar == "authenticated") {
                        $cookies.put('activeuser', $scope.userstr);
                        $state.go("user");
                    } else {
                        alert("incorrect username or password");
                    }
                }, function(err) {
                    console.log(err);
                });
        } else {
            alert("incorrect entries");
        }
    };
});

app.controller('registercontroller', function($scope, $state, $http) {

    $scope.register = function() {
        if($scope.newusername && $scope.newuseremail && $scope.newuserpass) {
            var newuserdata = {
                'username': $scope.newusername,
                'email': $scope.newuseremail,
                'password': $scope.newuserpass
            };
            $http.post('/post-register', newuserdata)
                .then(function(response) {
                    alert("response from server:"+response.data)
                    $state.reload('register');
            });
        } else {
            alert("incorrect entries");
        }
    }
});

app.controller('usercontroller', function($scope, $state, $http, $cookies, socket) {
    
    $http.post('/getuserdata', new Object({'activeuser':$cookies.get('activeuser')}))
    .then(function(response) {
        $scope.activeuser = response.data;
        $state.go('user.timeslots');
    });

    socket.on('sync timeslots', function(userdata) {
        $scope.activeuser = userdata;
        console.log("inside sync time",$scope.activeuser);
        $state.go('user',{},{reload:true});
        $state.go('user.timeslots');
    });

    $scope.logout = function() {
        $cookies.remove('activeuser');
        $state.go('login');
    };

    $scope.addslot = function() {
        $('.addslot').css('display', 'block');
    };

    $scope.updateinfo = function() {
        var day = $scope.addday;
        var time = $scope.addtime;
        if($scope.activeuser.timeslots[day].indexOf(time) == -1) {
            $scope.activeuser.timeslots[day].push(time);
        } 
        // socket.emit('update time slots', $scope.activeuser);
        $http.post('/updatetimeslots', $scope.activeuser)
        .then(function(response){
            console.log(response.data);
        });
    };

    $scope.removeslot = function(day, time) {
        console.log(time);
        $scope.activeuser.timeslots[day].splice(time, 1);
        // socket.emit('update time slots', $scope.activeuser);
        $http.post('/updatetimeslots', $scope.activeuser)
        .then(function(response){
            console.log(response.data);
        });
    };

    $scope.scheduleslot = function(day, time) {
        console.log(day);
        console.log(time);

    };
});

app.controller('schedulecontroller', function($scope, $state, $http, $cookies, socket) {
    console.log("inside schedule controller");
    $http.post('/getuserdata', {'activeuser':'vaibhav'})
    .then(function(response) {
        $scope.activeuser = response.data;
    });
    socket.on('sync timeslots schedule', function(userdata) {
        console.log(userdata);
        $scope.activeuser = userdata;
        console.log("inside sync time",$scope.activeuser);
        $state.go('schedule',{},{reload:true});
    });
});