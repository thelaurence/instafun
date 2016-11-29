var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema ({
    name: String,
    comment: String,
    upvotes: {type: Number, default: 0},
    imgNum: Number
});

CommentSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);