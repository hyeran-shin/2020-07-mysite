var User = require('../lib/user');

exports.form = function(req, res){
    res.render('./sign/signin',{ title : 'Sign In' })
};

exports.submit = function(req, res, next){
    var paramName = req.body.name, 
        paramPass = req.body.pw;

    // if(paramPass==''){
    //     res.error('비밀번호를 입력하세요');
    //     res.redirect('back');
    // }else if(paramName==''){
    //     res.error('아이디를 입력하세요');
    //     res.redirect('back');
    // }
   
        User.authenticate(paramName, paramPass, function(err, user){
            if(err) return next(err);
            if(user){
                req.session.uid = user.id;
                console.log(user+ "okokokokok");
                res.redirect('/');
                
            }else{
                console.log(user+ "nononono");
                res.error('인증되지 않은 회원입니다.');
                res.redirect('back');
            }
        });
    
};

exports.out = function(req, res){
    req.session.destroy(function(err, user){
        if(err) throw err;
        res.redirect('/');
    });
};