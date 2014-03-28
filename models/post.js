var mongodb = require('./db'),
    markdown = require('markdown').markdown,
    BSON = require('mongodb').BSONPure;

function Post(name, title, post, uid){
    this.name = name;
    this.title = title;
    this.post = post;
    this.uid = uid;
}

module.exports = Post;

//存储一片文章及其相关信息
Post.prototype.save = function(callback){
    var date = new Date();

    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    //要存入数据库的文档
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post,
        uid: this.uid
    };

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //读取posts合集
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //将文档插入posts集合
            collection.insert(post, {
                safe: true
            }, function(err){
                mongodb.close();
                if(err){
                    return callback(err); //失败返回err
                }
                callback(null);//成功返回err为null
            })
        });
    });
};


//读取文章及其相关信息
Post.getAll = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //根据 query 对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);//失败！返回 err
                    }
                    docs.forEach(function (doc) {
                        doc.post = markdown.toHTML(doc.post);
                    });
                    callback(null, docs);//成功！以数组形式返回查询的结果
                });
        });
    });
};

Post.getOne = function(id, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }

        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }


            var obj_id = BSON.ObjectID.createFromHexString(id);
            collection.findOne({
                "_id": obj_id
            }, function(err, doc){
                mongodb.close();
                if(err){
                    callback(err);
                }
                console.log(doc);
                doc.post = markdown.toHTML(doc.post);
                callback(null ,doc);
            })
        })
    })
};


//编辑
Post.edit = function(name, day, title, callback){
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                "name": name,
                "time.day": day,
                "title": title
            }, function(err, doc){
                mongodb.close();
                if(err){
                    if(err){
                        return callback(err);
                    }
                    callback(null, doc);
                }
            })
        })
    })
};
