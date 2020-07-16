var User = require('../lib/user');

exports.form = function(req, res , next){
    res.render('./sign/signup' , { title : 'Sign up'})
};

exports.submit = function(req, res, next){
    var paramName = req.body.name,
        paramPass = req.body.pw;
        
    User.getByName(paramName, function(err, user){
        if(err) return next(err);

        if(user.id){
            res.error('이미 존재하는 이름입니다.');
            res.redirect('back');
        }else{
            user = new User({
                name : paramName,
                pass : paramPass
            });

            user.save(function(err){
                console.log('회원가입 완료, signup.js');
                if(err) return next(err);
                req.session.uid = user.id;
                res.redirect('/');
            });
        }         
    });
};



