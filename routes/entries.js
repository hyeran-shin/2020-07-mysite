var Entry = require('../lib/entry');

exports.form = function(req, res, next){
    res.render('./post/post', { title : '글 작성'});
};

exports.submit = function(req, res, next){
    var title = req.body.title,
        body  = req.body.body;
    var entry = new Entry({
        "username" : res.locals.user.name,
        "title" : title,
        "body" : body
    });

    entry.save(function(err){
        if(err) return next(err);
        res.redirect('/');
    })
}

exports.list = function(req, res, next){
    var page = req.page
    Entry.getRange(page.from, page.to, function(err, entries){
        if(err) return next(err);

        res.render('./post/postList',{
            title : '글 목록',
            entries : entries
        });
    });
}