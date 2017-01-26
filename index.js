require('dotenv').config({ silent: true })
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
var passport = require('./config/ppConfig')
var ejsLayouts = require('express-ejs-layouts')
var flash = require('connect-flash')
var isLoggedIn = require('./middleware/isLoggedIn')
const path = require('path')
const app = express()

app.use('/css', express.static(__dirname + '/public/css'))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blog')

mongoose.Promise = global.Promise

app.set('view engine', 'ejs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(require('morgan')('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(ejsLayouts)
app.use(methodOverride('_method'))

app.use(function (req, res, next) {
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', function (req, res) {
  res.render('index', {layout: 'index', word: 'stranger.'})
})

app.use('/auth', require('./controllers/auth'))
app.use('/blogs', require('./controllers/blogs'))
app.use('/posts', require('./controllers/posts'))

app.use(isLoggedIn)

var server = app.listen(process.env.PORT || 3000)
console.log('Server up on 3000!')

module.exports = server
