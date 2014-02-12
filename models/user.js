var mongodb = require('./db')

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback){
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    }

    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err)
        }
        //读取users集合
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //将用户数据插入数据库
            collection.insert(user, {
                safe: true
            }, function(err, user){
                mongodb.close();
                if(err){
                    return callback(err); //错误返回错误信息
                }

                callback(null, user[0]); //成功错误是null,并返回储存后的用户
            });
        });
    });
}

//读取用户信息
User.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};