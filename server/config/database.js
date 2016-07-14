// config/database.js
require('dotenv').config();

var user = process.env.user;
var password = process.env.password;

module.exports = {
    'url': 'mongodb://' + user + ':' + password + '@ds011775.mlab.com:11775/tradethis'
};