var express = require('express')
var router = express.Router()
var Blog = require('../models/blog')
var Post = require('../models/post')
var isLoggedIn = require('../middleware/isLoggedIn')

// get single post + blog info
router.get('/:id', isLoggedIn, function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) res.status(404).json({msg: 'could not find post'})
    else {
      Blog.findById(post.blogId, function (err, blog) {
        res.render('blogs/postsingle', {post: post, blog: blog})
      })
    }
  })
})

// page for editing post
router.get('/:id/edit', isLoggedIn, function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    console.log(req.params.id)
    if (err) res.status(404).json({msg: 'could not find post'})
    else res.render('blogs/postedit', { post: post })
  })
})

// edit a post
router.put('/:id', isLoggedIn, function (req, res) {
  console.log(req.body)
  console.log('update function fired')
  Post.findOneAndUpdate({ _id: req.params.id },
    { title: req.body.title,
      content: req.body.content,
      image: req.body.image
    }, {new: true}, function (err, post) {
      console.log(req.body)
      if (err) res.status(422).json({msg: 'error updating post'})
      else { res.redirect('/posts/' + req.params.id) }
    })
})

// delete post
router.delete('/:id', isLoggedIn, function (req, res) {
  Post.findOneAndRemove({ _id: req.params.id }, function (err, post) {
    console.log(post)
    if (err) res.status(200).json({msg: 'error deleting post'})
    else res.redirect('/blogs/' + post.blogId)
  })
})

module.exports = router
