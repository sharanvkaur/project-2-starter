const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String },
  bg: { type: String },
  ownedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
