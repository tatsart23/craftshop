const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Login = mongoose.model('Login', LoginSchema, 'logintesti');

module.exports = Login;