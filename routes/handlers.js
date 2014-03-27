var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

function index(req, res) {
    var success = req.flash('success').toString();
    var error = req.flash('error').toString();
    Post.get(null, function (err, posts) {
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

exports.index = index;