var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

function index(req, res) {
    var success = req.flash('success').toString();
    var error = req.flash('error').toString();
    Post.getAll(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index', {
            title: 'insistx',
            user: req.session.user,
            posts: posts,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}

function posts(req, res){
    Post.getOne(req.params.id,function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('single_post', {
            title: req.params.title,
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}

exports.index = index;
exports.posts = posts;