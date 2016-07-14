// book model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
    userid: String,
    username: String,
    bookid: String,
    bookImg: String,
    bookTitle: String,
    requestedby: { type : Array , "default" : [] },
    authorized: Boolean
});

module.exports = mongoose.model('books', Book);