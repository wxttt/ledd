var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Tomato = require('../models/tomato.js'),
    Handlers = require('./handlers.js');

module.exports = function(app) {

    app.get('/', Handlers.index);

    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: 'insistx-注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success', '注册成功!');
                res.redirect('/');
            });
        });
    });

    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'insistx-登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
        });
    });

    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
        res.render('post', {
            title: 'insistx-发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
        var currentUser = req.session.user,
            post = new Post(currentUser.name, req.body.title, req.body.post, currentUser._id);
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');//发表成功跳转到主页
        });
    });

    app.get('/savetomato', checkLogin);
    app.get('/savetomato', function(req,res){
        var date  = new Date();

        Tomato.find(date, function(err){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '获取clock成功');
            res.redirect('/');
        })
    });


    app.post('/savetomato', checkLogin);
    app.post('/savetomato', function(req,res){
        var currentUser = req.session.user,
            tomato = new Tomato(req.body.content, currentUser._id);

        tomato.save(function(err){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '创建clock成功');
            res.redirect('/');
        });
    });



    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });


    app.get('/sbbird', function (req, res) {
        res.render('sbbird', {
            title: '傻逼鸟'
        });
    });



    //处理上传文件
    app.get('/upload', checkLogin);
    app.get('/upload', Handlers.uploadGet);

    app.post('/upload', checkLogin);
    app.post('/upload', Handlers.uploadPost);


    app.get('/p/:id', Handlers.posts);

    app.get('/tomatoClock', Handlers.tomatoClock);

    app.use(function (req, res) {
        res.render("404");
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
};