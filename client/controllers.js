
angular.module('myApp').controller('itemsController', ['$scope', '$rootScope', '$route', 'CookieService', 'BookService',
    function($scope, $rootScope, $route, CookieService, BookService) {

        var userid = CookieService.getCookie();


        $scope.allItems = function() {
            // initial values
            $scope.error = false;
            $scope.btnRequest = '';

            // call getAllBooks from service
            BookService.getAllBooks()
                // handle success
                .then(function(res) {
                    $scope.allBooks = res;   // results will include a complete list of all books in books collection
                    $rootScope.getMyRequests();
                    $rootScope.getRequestsForMe();
                    $rootScope.approved();
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error getting all the books available for trade";
                });
        };
        $scope.allItems();        


        $scope.requestBook = function(bookid) {
            // initial values
            $scope.error = false;
            $scope.success = false;
           var bookRequest = bookid;

            // call requestBook from service
            BookService.requestBook(userid, $rootScope.username, bookid)

                // handle success
                .then(function(res) {
                    if (res == null) {
                        $scope.error = true;
                        $scope.errorMessage = "Can't request your own book, or request the same book twice!";

                    } else {
                        console.log('request completed')  
                        $scope.btnRequest = bookRequest;                      
                        $scope.success = true;
                        $scope.successMessage = "Your request has been received";
                        $rootScope.getMyRequests();                       
                    }
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error requesting book";
                });
        };

        $scope.cancelMyRequest = function (bookid) {
            // initial values
            $scope.error = false;
            $scope.success = false;

            BookService.cancelMyRequest (bookid, userid) 
                // handle success
                .then(function(res) {
                    $rootScope.getMyRequests();
                    $scope.success = true;
                    $scope.successMessage = "Cancelled your request to trade"
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error cancelling your trade request";
                });
        }

        $scope.denyRequest = function (bookid, userid, username) {
            // initial values
            $scope.error = false;
            $scope.success = false;

            BookService.denyRequest (bookid, userid)             
                // handle success
                .then(function(res) {
                    $rootScope.getRequestsForMe();
                    $scope.success = true;
                    $scope.successMessage = "'" + username + "' denied the request to trade"
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error removing this trade request";
                });
        }

        $scope.approveRequest = function (bookid, userid, username) {
            // initial values
            $scope.error = false;
            $scope.success = false;

            BookService.approveRequest (bookid, userid, username)             
                // handle success
                .then(function(res) {
                    $rootScope.getRequestsForMe();
                    $rootScope.approved();
                    $scope.success = true;
                    $scope.successMessage = "You approved " + username + "'s request to trade"
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error removing this trade request";
                });
        }


        $scope.retractApproval = function (bookid) {

            BookService.retract(bookid)
                // handle success
                .then(function(res) {
                    $rootScope.approved();
                    $rootScope.getMyRequests();
                    $rootScope.getRequestsForMe();                    
                })
                // handle error
                .catch(function() {
                    console.log('error getting myTradeRequests');
                })
        }
    }
]);


angular.module('myApp').controller('myItemsController', ['$scope', '$rootScope', '$route', 'BookService', 'CookieService',
    function($scope, $rootScope, $route, BookService, CookieService) {

        var userid = CookieService.getCookie();

        $scope.myItems = function() {
            // initial values
            $scope.error = false;


            // call getMyBooks from service
            BookService.getMyBooks(userid)
                // handle success
                .then(function(res) {
                    $scope.myBooks = res;   // results will include a complete list of all books in books collection
                    $scope.dbResults = false;  // hide the table of search results
                    $rootScope.getMyRequests();
                    $rootScope.getRequestsForMe();
                    $rootScope.approved();

                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error getting myItems";
                });
        };
        $scope.myItems();
        
        $scope.search = function() {
            // initial values
            $scope.error = false;
            $scope.disabled = true;
            $scope.dbResults = false;

            // call search from service
            BookService.search($scope.searchForm.search)
                // handle success
                .then(function(res) {
                    $scope.bookSearch = res.items;
                    $scope.disabled = false;
                    $scope.dbResults = true;
                    $scope.searchForm = {};
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error retrieving books";
                    $scope.searchForm = {};
                });
        };

        $scope.addBook = function(bookid, bookImg, bookTitle) {
            // initial values
            $scope.error = false;

            // call addBook from service
            BookService.addBook(userid, bookid, bookImg, bookTitle, $rootScope.username)

                // handle success
                .then(function(res) {
                    $scope.myBooks = res;   // results will include a complete list of all books in books collection
                    $scope.dbResults = false;  // hide the table of search results
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error adding book";
                });
        };

        $scope.removeBook = function(bookid) {
            // initial values
            $scope.error = false;
            // call addBook from service
            BookService.removeBook(userid, bookid)

                // handle success
                .then(function(res) {
                    $scope.myBooks = res;   // results will include a complete list of all books in books collection
                    $scope.dbResults = false;  // hide the table of search results
                    $rootScope.getRequestsForMe();
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error removing book";
                });
        };
    }
]);

angular.module('myApp').controller('loginController', ['$scope', '$rootScope', '$location', '$route', 'AuthService', 'CookieService',
    function($scope, $rootScope, $location, $route, AuthService, CookieService) {

        $scope.login = function() {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                // handle success
                .then(function(res) {
                    $location.path('/');
                    $scope.disabled = false;
                    $scope.loginForm = {};
                    $rootScope.logged = true;
                    CookieService.setCookie(res.user, res.username);
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });
        };
    }
]);

angular.module('myApp').controller('settingsController', ['$scope', '$rootScope', '$location', '$route', 'AuthService', 'CookieService',
    function($scope, $rootScope, $location, $route, AuthService, CookieService) {

        var userid = CookieService.getCookie();

        $scope.getSettings = function() {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call the getSettings from service
            AuthService.getSettings(userid)
            
                //handle success
                .then(function(res) {
                    $location.path('/settings');
                    $scope.disabled = false;
                    $scope.settingsForm = {
                        first: res.data.first,
                        last: res.data.last,
                        city: res.data.city,
                        state: res.data.state
                    };
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Couldn't get the settings";
                    $scope.disabled = false;
                    $scope.settingsForm = {};
                });
        };
        $scope.getSettings();


        $scope.updateSettings = function() {
            // initial values
            $scope.success = false;
            $scope.error = false;
            $scope.disabled = true;

            // call updateSettings from service
            AuthService.updateSettings(userid, $scope.settingsForm.first, $scope.settingsForm.last, $scope.settingsForm.city, $scope.settingsForm.state)

                // handle success
                .then(function(res) {
                    $location.path('/settings');
                    $scope.success = true;
                    $scope.successMessage = "Settings Updated!"
                    $scope.disabled = false;
                    $scope.settingsForm = {
                        first: res.data.first,
                        last: res.data.last,
                        city: res.data.city,
                        state: res.data.state
                    };
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid first, last, city or state";
                    $scope.disabled = false;
                    $scope.settingsForm = {};
                });
        };
    }
]);

angular.module('myApp').controller('logoutController', ['$scope', '$rootScope', '$location', 'AuthService',
    function($scope, $rootScope, $location, AuthService) {

        $scope.logout = function() {

            // call logout from service
            AuthService.logout()
                .then(function() {
                    $rootScope.logged = false;
                    $location.path('/login');
                });
        };
    }
]);

angular.module('myApp').controller('registerController', ['$scope', '$location', '$timeout', '$route', 'AuthService',
    function($scope, $location, $timeout, $route, AuthService) {

        $scope.register = function() {

            // initial values
            $scope.error = false;
            $scope.success = false;
            $scope.disabled = true;

            // call register from service
            AuthService.register($scope.registerForm.username, $scope.registerForm.password)
                // handle success
                .then(function() {
                    $scope.success = true;
                    $scope.successMessage = "Registration Complete!"
                    $scope.disabled = false;
                    $scope.registerForm = {};
                    $timeout(function() {
                    $location.path('/login');
                    }, 4000);

                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                    $scope.disabled = false;
                    $scope.registerForm = {};
                });
        };
    }
]);


angular.module('myApp').controller('indexController', ['$scope', '$rootScope', '$route', '$timeout', 'AuthService', 'BookService', 'CookieService',
    function($scope, $rootScope, $route, $timeout, AuthService, BookService, CookieService) {

        // initialize the 'logged' variable
        $rootScope.logged = false;

        // initialize userid
        var userid = CookieService.getCookie();

        // initialize username for use throughout the site
        $rootScope.username = CookieService.getCookieUsername();

        // check if user is logged in 
        // used to update 'logged' variable for the navbar to show/hide nav elements
        AuthService.getUserStatus()
            .then(function() {
                $rootScope.logged = AuthService.isLoggedIn();
            });


        // THESE FUNCTIONS ARE MADE GLOBALLY AVAILABLE
        // get the number requests the logged in user has made
        $rootScope.getMyRequests = function () {   

            BookService.myTradeRequests(userid)
                // handle success
                .then(function(res) {
                    $rootScope.myRequests = res;
                    $rootScope.myTradeRequests = res.length;
                })
                // handle error
                .catch(function() {
                    console.log('error getting myTradeRequests');
                })
        }

        // get the requests for books the logged in user wants to trade
        $rootScope.getRequestsForMe = function () {

            BookService.tradeRequestsForMe(userid)
                // handle success
                .then(function(res) {
                    $rootScope.requestsForMe = res;
                    $rootScope.tradeRequestsForMe = res.length;
                })
                // handle error
                .catch(function() {
                    console.log('error getting tradeRequestsForMe');
                })
        }    

        $rootScope.approved = function () {
            // initial values
            $scope.error = false;
            $scope.success = false;

            BookService.approved (userid)             
                // handle success
                .then(function(res) {
                    $rootScope.approvedResults = res;
                    $rootScope.approvedQty = res.length;
                })
                // handle error
                .catch(function() {
                    $scope.error2 = true;
                    $scope.errorMessage = "Error gettomg approved trade requests";
                });
        }
    }
]);