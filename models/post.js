const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {type: String},
  content: {type: String},
  image: {type: String},
  updated: {type: Date, default: Date.now},
  blogId: {type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
