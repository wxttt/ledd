var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    fs = require('fs');

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


function uploadGet(req, res){
    res.render('upload', {
        title: '文件上传',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

function uploadPost(req, res){
    for (var i in req.files) {
        if (req.files[i].size == 0){
            // 使用同步方式删除一个文件
            fs.unlinkSync(req.files[i].path);
            console.log('Successfully removed an empty file!');
        } else {
            var target_path = './public/images/' + req.files[i].name;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files[i].path, target_path);
            console.log('Successfully renamed a file!');
        }
    }
    req.flash('success', '文件上传成功!');
    res.redirect('/upload');
}

function tomatoClock(req, res){
    res.render('tomatoClock', {
        title: '日历demo垃圾版'
    });
}




exports.index = index;
exports.posts = posts;
exports.uploadGet = uploadGet;
exports.uploadPost = uploadPost;
exports.tomatoClock = tomatoClock;