var express = require('express');
var nodemailer = require ('nodemailer');
var flash = require('express-flash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var assert = require('assert');
var ejs = require('ejs');
var async = require('async');
var mongoose = require('mongoose');
var React = require('react');
var app = express();
require('babel-core/register');
var randtoken = require('rand-token');
var multer  = require('multer')
var _ = require('lodash');
var Temps = require('../models/token')
//var nev = require('email-verification')(mongoose);
//const authRoutes = require('./routes/auth');
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, ''));
// app.set('view engine', 'ejs');
// app.set('', __dirname + 'index.html');
 // app.engine('html', require('ejs').renderFile);
 // app.set('view engine', 'html');
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '')));

//********Registration**************

//mongoose.connect('mongodb://charmic:lanetteam1@ds153853.mlab.com:53853/testdata');
mongoose.connect('mongodb://localhost:27017/pagination');
const User=require('.././models/user.js');

app.post('/data', function(req, res) {
    var user = req.body;
    const newUser = new User(user);
    // Generate a 32 character alpha-numeric token:
    var token = randtoken.generate(32);
     //newUser.image = '';
    newUser.token = token;
    console.log(newUser);
    /////******* upload img*********

    User.findOne({email: req.body.email}, function (err, result) {
        if (err) {
            return res.send(err)
        }
        if (result === null) {
            newUser.save(function (err, result) {
                if (err) {
                    return res.send({msg: err});
                } else {
                    //res.send({msg: "Registered successfully", user: newUser})
                    console.log('Registered successfully')
                    // Create a verification token for this user
                    var token = new Temps();
                    token._userId = result._id;
                    token.token = result.token;
                    console.log('saved---', token.token);
                    // Save the verification token
                    token.save(function (err) {
                        if (err) {
                            return res.send({msg: err});
                        }
                        console.log('saved----', token)
                        // Send the email
                        console.log(newUser.token)
                    });
                }
            });
        } else {
            res.send({msg: 'already exist'})
        }
        console.log('result2---',result);
    })
})

//---------------get Data
app.get('/data',function (req,res) {
    User.find(function (err,test1) {
        if(err)
        {
            throw err;
        }
        res.send(test1);
    });
});

//------------------Delete Data
app.delete('/data/:id',function (req,res) {
    var query={_id:req.params.id};
    User.remove(query,function (err,test1) {
        if(err)
        {
            console.log("# API delete Error",err);
        }
        res.json(test1);
    });
});

app.put('/data/:id',function (req, res) {
    var test = req.body ;
    console.log('req.body', req.body)
    var query = req.params.id;
    //console.log('path',req.files.path )
    var update = {
        '$set':
        {
                username: test.username,
                email: test.email,
                password: test.password,
            }};
    var options = {new : true};
    User.findOneAndUpdate(query, update, options, function (err, test2) {
        if(err){
            throw err;
        }
        res.json(test2)
    })
});
app.get('/data/:id',function (req, res) {
    User.find({_id: req.params.id},function (err,result) {
        if(err){
            return res.send({msg:err});
        }
        res.send({user:result});
    })
})

//*******************Login***********************

 app.post('/login/data', function(req, res) {
     User.findOne({email: req.body.email}, function (err, user) {
         //console.log('user---', req.body.password)
         if (!user) {
             return res.send({msg: 'The email address ' + req.body.email + ' is not correct. Check email again'});
         }
         // console.log(user.password)
         //  if(user.password === req.body.password) {
         //      if (!user.isVerified)
         //          return res.send({type: 'not-verified', msg: 'Your password is wrong.'});
              //else
                 user.token = randtoken.generate(32);
                 user.save(function (err, result) {
                     if (err) {
                         return res.send({msg: err.message});
                     }
                     console.log("Successful login.");
                     var token = new Temps();
                     token._userId = result._id;
                     token.token = result.token;
                     console.log('token', token)
                     console.log('saved---', token._userId);
                     console.log('newuser', result.token)
                     // Save the verification token
                     Temps.updateOne({_userId: result._id}, {token: result.token}, function (err, result_id) {
                         if (err) {
                             return res.send({msg: err});
                         }
                     });
                     res.send({user: user.toJSON(), token: result.token, msg: "successful login"});
                 });
                 // else {
                 //     return res.send({msg: 'Invalid email or password'})
                 // }
                 // user.comparePassword(req.body.password, function (err, isMatch) {
                 //     if (!isMatch) return res.send({msg: 'Invalid email or password'});
                 //
                 //     // Make sure the user has been verified
                 //     if (!user.isVerified) return res.send({
                 //         type: 'not-verified',
                 //         msg: 'Your account has not been verified.'
                 //     });
                 //
                 //     // Login successful, write token, and send back user
                 //     res.send({token: generateToken(user), user: user.toJSON()});
                 // });
         // else{
         //     return res.send({msg: 'Invalid email or password'})
         // }
     });
 })

//*********forgot pwd*********

app.post('/forgot_password', function(req, res, next) {
     var email = req.body.email;
     console.log('email', email)
     User.findOne({email: email}, function (err, result) {
         if (err) {
             return res.send(err)
         }
         User.token = randtoken.generate(32);
         console.log('result-token', User.token);
     });
 });

app.get('/getAllUsers', function (req,res) {
console.log('data')
    userData.find()
        .populate('userId')
        .populate('commentId')
        .populate('likeId')
        .populate({
            path: 'commentId',
            model: 'comments',
            populate: {
                path: 'userId',
                model: 'User'
            }
        })
        .populate({
            path: 'commentId',
            model: 'comments',
            populate: {
                path: 'frdId',
                model: 'User'
            }
        })
        .exec(function (err, result) {
            console.log(err)
            if (err) {
                return res.send({msg: err});
            }
            res.send({posts: result});
        })
})

//******** admin**********
app.post('/admin_verification', function(req, res, next, user) {
    //check user acct verified
    //sent mail -> ur acct is not verified. Pls verify }
    //console.log('user', user)
    console.log('users')
    // if (user.isVerified)
    //     return res.send({
    //         type: 'verified',
    //         msg: 'Your account has been verified.'
    //     });
    // else {
        console.log('send for verification');
        const sgReq = Sendgrid.emptyRequest({
            method: 'POST',
           // path: '/v3/mail/send',
            body: {
                personalizations: [{
                    to: [{email: "lanetteam.charmic@gmail.com"}],
                    subject: 'Account Verification email'
                }],
                from: {email: "lanetteam.charmic@gmail.com"},
                content: [{
                    type: 'text/plain',
                    value: 'Sendgrid on Google App Engine with Node.js.'
                }]
            },
        })
        console.log('send grid');
        Sendgrid.API(sgReq, (err) => {
            if (err) {
                next(err);
                return err;
            }
            // Render the index route on success
            // res.render('/sendMail', {
            //     sent: true
            // });
        });
    //}
})

//api for delete acct
app.delete('delete_acct/username', function(req, res) {
    User.remove({username: req.params.username},function (err,test1) {
        if(err)
        {
            console.log(" API delete Error",err);
        }
        res.json(test1);
    });
});

app.listen(4500,function (err) {
    if(err){
        return console.log(err);
    }
    console.log("API Server Is running on 4500");
});
module.exports = app;

// reg, login, forgot_pwd, admin(2)