/**
 * 番茄时钟model实现
 * create by wxttt
 */

var mongodb = require('./db');

function Tomato(content, uid){
    this.content = content;
    this.uid = uid;
}

module.exports = Tomato;

Tomato.prototype.save = function(callback){
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
    var tomato = {
        content: this.content,
        createTime: time,
        day: time.day,
        startTime: 0,
        status:0,
        uid: this.uid
    };

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //读取tomatos合集
        db.collection('tomatos', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //将文档插入tomato集合
            collection.insert(tomato, {
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

Tomato.find = function(date, callback){
    //获取某天的番茄钟列表
    //打开数据库
    console.log('date is', date)
    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }

        var query = {
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        };

        db.collection('tomatos', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            console.log(query);
            collection.find(query).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                console.log(docs);
                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        })
    })
};

