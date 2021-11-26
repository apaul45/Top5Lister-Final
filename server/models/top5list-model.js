const mongoose = require('mongoose')
const Schema = mongoose.Schema
//owner should be a field mapping the list to a username of a user

/*comments should be a list of objects where each user's comment is mapped to their email 
(should be a list mapped to a email since multiple comments are allowed)*/

//isPublished is a field used to separate a user's saved lists from all published ones (so different screens get different lists)
const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        owner: {type: String, required: true},
        comments: {type:[String, String], required: true},
        likes: {type: Number, required: true},
        dislikes: {type: Number, required: true},
        views: {type: Number, required: true},
        isPublished: {type: Boolean, required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
