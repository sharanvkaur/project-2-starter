var express = require('express')
var router = express.Router()
var Blog = require('../models/blog')
var Post = require('../models/post')
var isLoggedIn = require('../middleware/isLoggedIn')

// view all blogs
router.get('/', isLoggedIn, function (req, res) {
  Blog.find({ownedBy: req.user}, function (err, blogs) {
    if (err) res.status(404).json({msg: 'cannot find any blogs'})
    else {
      res.render('blogs/blogoverview', {blogs: blogs})
    }
  })
})

// page for new blog
router.get('/new', isLoggedIn, function (req, res) {
  res.render('blogs/blognew')
})

// create new blog
router.post('/', isLoggedIn, function (req, res) {
  req.body['ownedBy'] = req.user
  Blog.create(req.body, function (err, blog) {
    console.log(req.body)
    if (err) res.status(422).json({msg: 'could not create blog'})
    else res.redirect('/blogs')
  })
})

// page for editing blog
router.get('/:id/edit', isLoggedIn, function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) res.status(404).json({msg: 'could not find blog'})
    else res.render('blogs/blogedit', { blog: blog })
  })
})

// edit a blog
router.put('/:id', isLoggedIn, function (req, res) {
  console.log(req.body)
  console.log('update function fired')
  Blog.findOneAndUpdate({ _id: req.params.id }, {
    name: req.body.name,
    description: req.body.description,
    color: req.body.color,
    bg: req.body.bg
  }, {new: true}, function (err, blog) {
    console.log(req.body)
    if (err) res.status(422).json({msg: 'error updating'})
    else { res.redirect('/blogs') }
  })
})

// delete blog
router.delete('/:id', isLoggedIn, function (req, res) {
  Blog.findOneAndRemove({ _id: req.params.id }, function (err, blog) {
    if (err) res.status(200).json({msg: 'error deleting'})
    else res.redirect('/blogs')
  })
})

// view all posts
router.get('/:id', isLoggedIn, function (req, res) {
  Post.find({ blogId: req.params.id }, function (err, posts) {
    console.log(posts)
    if (err) res.status(404).json({msg: 'could not find posts'})
    else {
      Blog.findById(req.params.id, function (err, blog) {
        res.render('blogs/postsoverview', {posts: posts, blogId: req.params.id, blog: blog})
      })
    }
  })
})

// page for new blog
router.get('/:id/new', isLoggedIn, function (req, res) {
  res.render('blogs/postnew', {blogId: req.params.id})
})

// create new post
router.post('/:id', function (req, res) {
  req.body['blogId'] = req.params.id
  Post.create(req.body, function (err, post) {
    console.log(req.body._id)
    if (err) res.status(422).json({msg: 'could not create post'})
    else res.redirect('/blogs/' + req.params.id)
  })
})

module.exports = router
