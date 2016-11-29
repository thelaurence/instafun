var express = require('express');
var request = require('request');
var fs = require('fs');
var mongoose = require('mongoose');
var CommentModel = mongoose.model('Comment');
var router = express.Router();
var insta_token = "";

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('instafun.html', { root: 'public' });
});

/* GET a random one of my own instagram photos */
router.get('/photo', function(req, res) {
  var instagramUrl = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + insta_token;
  request({ uri: instagramUrl, json: true }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var index = Math.floor((Math.random() * body['data'].length));
      var randomPost = body['data'][index];
      var imageUrl = randomPost['images']['standard_resolution']['url'];
      res.json({
        photoUrl: imageUrl,
        imgNum: index
      });
    }
  });
});

/* GET the next instagram photo */
router.get('/next', function(req, res) {
  var instagramUrl = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + insta_token;
  request({ uri: instagramUrl, json: true }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var index = req.query.imgNum;
      console.log('index: ' + index);
      if(index > body['data'].length - 1) { index = 0; }
      else if(index < 0) { index = body['data'].length - 1; }
      console.log('index: ' + index);
      console.log('data length: ' + body['data'].length );
      var post = body['data'][index];
      var imageUrl = post['images']['standard_resolution']['url'];
      res.json({
        photoUrl: imageUrl,
        imgNum: index
      });
    }
  });
});

/* POST a new comment */
router.post('/comment', function(req, res, next) {
  var comment = new CommentModel(req.body);
  comment.save( function(err, comment) {
    if (err){ return next(err); }
    res.json(comment);
  });
});

/* GET all comments on the same photo */
router.get('/comments', function(req, res, next) {
  CommentModel.find({ imgNum: req.query.imgNum }, function(err, commentList) {
    if (err) { return next(err); }
    res.json(commentList);
  });
});

router.param('comment', function(req, res, next, id) {
  var query = CommentModel.findById(id);
  query.exec(function (err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }
    req.comment = comment;
    return next();
  });
});

router.get('/comments/:comment', function(req, res) {
  res.json(req.comment);
});

router.put('/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    res.json(comment);
  });
});

module.exports = router;
