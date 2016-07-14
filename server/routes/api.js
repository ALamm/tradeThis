var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require("request");

var User = require('../models/user.js');
var Book = require('../models/books.js');

router.post('/cancelMyRequest', function (req, res) {
    Book.update( {bookid: req.body.bookid}, 
    { $pull: { requestedby: {userid: req.body.userid}}}, 
    function (err,docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }                   
        return res.status(200).json({
            status: 'Cancelled your book request',
            docs: docs                
        });
    });
});

router.post('/denyRequest', function (req, res) {
    Book.update( {bookid: req.body.bookid}, 
    { $pull: { requestedby: {userid: req.body.userid}}}, 

    function (err,docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }                   
        return res.status(200).json({
            status: 'Cancelled trade request',
            docs: docs                
        });
    });
});

router.post('/approveRequest', function (req, res) {
    Book.update( {bookid: req.body.bookid}, 
    { requestedby: [{userid: req.body.userid, username: req.body.username}], authorized: true},
    {new: true}, 
    function (err,docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }                   
        return res.status(200).json({
            status: 'Cancelled trade request',
            docs: docs                
        });
    });
});

router.post('/retract', function (req, res) {
    Book.update( {bookid: req.body.bookid}, 
    { requestedby: [], authorized: false},
    {new: true}, 
    function (err,docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }                   
        return res.status(200).json({
            status: 'Cancelled trade request',
            docs: docs                
        });
    });      
});

router.post('/approved', function (req, res) {
    Book.find( { $or: [ {userid: req.body.userid, authorized: true}, {'requestedby.userid': req.body.userid, authorized: true} ] }, function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }   
        return res.status(200).json({
            status: 'Retrieved records of authorized requests!',
            docs: docs                
        });        
    });
});

router.post('/myTradeRequests', function (req, res) {
    Book.find( {'requestedby.userid': req.body.userid, authorized: false}, function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }                   
        return res.status(200).json({
            status: 'Retrieved records of your book requests!',
            docs: docs                
        });        
    });
});

router.post('/tradeRequestsForMe', function (req, res) {
    // get all requests that have a 'requestedby' field, that has not yet been authorized
    Book.find( {userid: req.body.userid, requestedby:{$gt: []}, authorized: false}, function (err, docs) {  //:{ $exists: true, $ne: [] }
        if (err) {
            return res.status(500).json({
                err: err
            });
        }
        else {
            //    // MODIFY THE RESULTS TO CREATE A UNIQUE RECORD FOR EACH REQUEST
            //     if the returned object has multiple 'requestedby.userid' values 
            //     (e.g. more than one person has requested the same book, then create a unique record for each one
            var arr = [];
            var results = JSON.parse(JSON.stringify(docs));
            
            var createObj = function (id, username) {
                var obj = JSON.parse(JSON.stringify(docs[0]));
                obj.requestedby = [];
                obj.requestedby.push( { userid: id, username: username } )
                return obj;
            }            

            for (var i = 0; i < docs.length; i++) {                
                if (docs[i].requestedby.length > 1) {
                    results.splice(i,1);
                    for (var j = 0; j < docs[i].requestedby.length; j++) {
                        arr.push( {userid: docs[i].requestedby[j].userid, username:  docs[i].requestedby[j].username } ); 
                    }
                    for (var k = 0; k < arr.length; k++) {
                        results.push ( createObj ( arr[k].userid, arr[k].username ) );
                    }
                }
            }
            return res.status(200).json({
                status: 'Retrieved records of requests for your books!',
                docs: results                
            });    
        }    
    });
});


router.get('/allItems', function (req, res) {
    // find all books that have not been 'authorized' to be lent yet
    Book.find( {authorized:false, }, function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }                   
        return res.status(200).json({
            status: 'Retrieved all the books in All Items!',
            docs: docs                
        });
    });    
});

router.post ( '/requestBook', function (req, res) {
    var options = [
        {new: true}
    ]
    // user can't request their own book -    {'$ne':req.body.userid} 
    // user can't request a book twice  -     'requestedby.userid': {'$ne':req.body.userid
    Book.findOneAndUpdate( {bookid: req.body.bookid, userid: {'$ne':req.body.userid}, 'requestedby.userid': {'$ne':req.body.userid}}, 
        {$push: {requestedby: {userid: req.body.userid, username: req.body.username}}},
        options, 
        function (err, docs) {
        if (err) {
            return res.status(500).json( {
                err: err});
        }
        return res.status(200).json({
            status: 'Request for book received!',
            docs: docs                
        }); 
    });
});

router.post('/myItems', function (req, res) {
    Book.find( {userid: req.body.userid, authorized: false}, function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }           
        return res.status(200).json({
            status: 'Retrieved all the books in myItems!',
            docs: docs                
        });
    })    
})


router.post('/bookSearch', function(req, res) {
    var path = 'https://www.googleapis.com/books/v1/volumes?q=' + req.body.searchterm + '&maxResults=4'+ '&projection=lite' + '&key=' + process.env.googleapi;
    // use the request module to make an http get request to Google's Book search engine
    request(path, function(error, response, body) {

        if (error) {
            return res.status(500).json({
                err: err
            });
        }
        if (!error && response.statusCode == 200) {
            return res.status(200).json({
                status: 'Search successful!',
                body: JSON.parse(body)
            });
        }
    });
});

router.post('/addBook', function(req, res) {
    Book.create( {userid: req.body.userid, username: req.body.username, bookid: req.body.bookid, bookImg: req.body.bookImg, bookTitle: req.body.bookTitle, authorized: false}, 
        function(err, book) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            Book.find( {userid: req.body.userid}, function (err, docs) {
                if (err) {
                    return res.status(500).json({
                        err: err
                    });
                } else {
                    return res.status(200).json({
                        status: 'Added Book!',
                        docs: docs                
                    });
                } 
            })
        }
    });
});

router.post('/removeBook', function (req, res) {
    Book.remove( {userid: req.body.userid, bookid: req.body.bookid}, function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            Book.find( {userid: req.body.userid}, function (err, docs) {
                if (err) {
                    return res.status(500).json({
                        err: err
                    });
                } else {
                    return res.status(200).json({
                        status: 'Removed Book!',
                        docs: docs                
                    });
                }
            })
        }
    });    
});


router.post('/register', function(req, res) {
    User.register(new User({
            username: req.body.username
        }),
        req.body.password,
        function(err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function() {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
});


router.post('/getSettings', function(req, res) {
    User.findOne(
        {_id: req.body.id}, 
        function(err, data) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            return res.status(200).json({
                status: 'Retrieved Settings!',
                data: data
            });
        }
    });
});


router.post('/updateSettings', function(req, res) {
    User.findOneAndUpdate(
        {_id: req.body.id},
        { $set: 
            {
            first: req.body.first,
            last: req.body.last,
            city: req.body.city,
            state: req.body.state
            }
        }, 
        {new: true}, 
        function(err, data) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            return res.status(200).json({
                status: 'Updated Settings!',
                data: data
            });
        }
    });
});


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!',
                user: user._id,
                username: user.username
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function(req, res) {

    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
});

module.exports = router;