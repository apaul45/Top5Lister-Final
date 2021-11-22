const mongoose = require('mongoose')
const Schema = mongoose.Schema
//owner should be a single object where each user's name is mapped to their unique email

/*comments should be a list of objects where each user's comment is mapped to their email 
(should be a list mapped to a email since multiple comments are allowed)*/
const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        owner: {type: {email:String, name:String}, required: true},
        comments: {type: [{user: String, userComments: [String]}], required: true},
        likes: {type: Number, required: true},
        dislikes: {type: Number, required: true},
        views: {type: Number, required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
