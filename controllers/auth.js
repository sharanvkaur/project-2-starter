var express = require('express')
var router = express.Router()
var User = require('../models/user')
var passport = require('../config/ppConfig')

router.get('/signup', function (req, res) {
  console.log('sign up page')
  res.render('auth/signup')
})

router.post('/signup', function (req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      console.log('An error occurred: ' + err)
      res.redirect('/auth/signup')
    }
    if (!user) {
      User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      }, function (err, createdUser) {
        if (err) {
          req.flash('error', 'Could not create user account')
          res.redirect('/auth/signup')
        } else {
          // Authenticate with passport
          passport.authenticate('local', {
            successRedirect: '/blogs',
            successFlash: 'Account created and logged in'
          })(req, res)
        }
      })
    } else {
      req.flash('error', 'Email already exists')
      res.redirect('/auth/login')
    }
  })
})

router.get('/login', function (req, res) {
  console.log('login page')
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/blogs',
  successFlash: 'You have logged in',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password'
}))

router.get('/logout', function (req, res) {
  req.logout()
  console.log('logged out')
  req.flash('success', 'You have logged out')
  res.redirect('/')
})

module.exports = router
