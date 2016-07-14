angular.module('myApp').factory('CookieService', ['$cookies',
    function($cookies) {

        // return available functions for use in the controllers
        return ({
            setCookie: setCookie,            
            getCookie: getCookie,
            getCookieUsername: getCookieUsername
        });

        function setCookie (userid, username) { 
            // Set cookie
            $cookies.put('userid', userid);    //key, value  
            $cookies.put('username', username);      
        }
        function getCookie () {
            // Retrieve cookie
           return $cookies.get('userid');  
        }
        function getCookieUsername () {
            return $cookies.get('username');
        }
    }
]);


angular.module('myApp').factory('BookService', ['$q', '$timeout', '$http',
    function($q, $timeout, $http) {

        // return available functions for use in the controllers
        return ({
            getMyBooks: getMyBooks,
            getAllBooks: getAllBooks,
            search: search,
            addBook: addBook,
            removeBook: removeBook,
            requestBook: requestBook,
            myTradeRequests: myTradeRequests,
            tradeRequestsForMe: tradeRequestsForMe,
            cancelMyRequest: cancelMyRequest,
            denyRequest: denyRequest,
            approveRequest: approveRequest,
            approved: approved,
            retract: retract
        });


        function cancelMyRequest(bookid, userid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            $http.post('/user/cancelMyRequest', {
                userid: userid,
                bookid: bookid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        } 

        function denyRequest(bookid, userid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            $http.post('/user/denyRequest', {
                userid: userid,
                bookid: bookid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function approveRequest(bookid, userid, username) {
            // create a new instance of deferred
            var deferred = $q.defer();
            $http.post('/user/approveRequest', {
                userid: userid,
                username: username,
                bookid: bookid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }  

        function retract(bookid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            $http.post('/user/retract', {
                bookid: bookid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        } 

        function approved(userid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            $http.post('/user/approved', {
                userid: userid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }  

        function myTradeRequests(userid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            $http.post('/user/myTradeRequests', {
                userid: userid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }  

        function tradeRequestsForMe(userid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            $http.post('/user/tradeRequestsForMe', {
                userid: userid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }          

        function getMyBooks(userid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/myItems', {
                    userid: userid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function getAllBooks() {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.get('/user/allItems')
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function search(searchterm) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/bookSearch', {
                    searchterm: searchterm
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.body);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function addBook(userid, bookid, bookImg, bookTitle, username) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/addBook', {
                    userid: userid,
                    username: username,
                    bookid: bookid,
                    bookImg: bookImg,
                    bookTitle: bookTitle
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function removeBook(userid, bookid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/removeBook', {
                    userid: userid,
                    bookid: bookid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function requestBook(userid, username, bookid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/requestBook', {
                    userid: userid,
                    username: username,
                    bookid: bookid
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }        
    }
]);


angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http',
    function($q, $timeout, $http) {

        // create user variable
        var user = null;

        // return available functions for use in the controllers
        return ({
            isLoggedIn: isLoggedIn,
            getUserStatus: getUserStatus,
            login: login,
            logout: logout,
            register: register,
            updateSettings: updateSettings,
            getSettings: getSettings
        });

        function isLoggedIn() {
            if (user) {
                return true;
            } else {
                return false;
            }
        }

        function getUserStatus() {
            return $http.get('/user/status')
                // handle success
                .success(function(data) {
                    if (data.status) {
                        user = true;
                    } else {
                        user = false;
                    }
                })
                // handle error
                .error(function(data) {
                    user = false;
                });
        }

        function login(username, password) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/login', {
                    username: username,
                    password: password
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        user = true;
                        deferred.resolve(data);
                    } else {
                        user = false;
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    user = false;
                    deferred.reject();
                });

            // return promise object
            return deferred.promise;
        }

        function getSettings(id) {
            // create a new instance of deferred  
            var deferred = $q.defer();
            // get the user settings from the server
            $http.post('/user/getSettings', {
                    id: id
                })
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function updateSettings(id, first, last, city, state) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/updateSettings', {
                    id: id,
                    first: first,
                    last: last,
                    city: city,
                    state: state
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function logout() {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a get request to the server
            $http.get('/user/logout')
                // handle success
                .success(function(data) {
                    user = false;
                    deferred.resolve();
                })
                // handle error
                .error(function(data) {
                    user = false;
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;

        }

        function register(username, password) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/register', {
                    username: username,
                    password: password
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }
    }
]);