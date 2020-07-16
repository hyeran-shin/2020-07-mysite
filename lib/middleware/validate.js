function parseField(field) {
    return field.split().filter(function(s) { return s });
}

function getField(req, field) {
    var val = req.body;
    field.forEach(function(prop) {
        val = val[prop]; 
    });
    return val;
}

exports.required = function(field) {
    field = parseField(field);
    return function(req, res, next) {
        if(getField(req, field)) {
            next(); 
        } else {
            res.error(field + ' 필수 입력 사항입니다!');
            res.redirect('back'); 
        }
    };
};

exports.lengthAbove = function(field, len) {
    field = parseField(field);
    return function(req, res, next) {
        if(getField(req, field).length >= len) {
            next();
        } else {
            res.error(field + ' 입력 길이가 ' + len + '자 이상이어야 합니다.');
            res.redirect('back');
        }
    }
}

// Q. 입력 길이를 제한하는 역할의 미들웨어 함수를 만드세요.
exports.lengthLimit = function(field, len) {
    field = parseField(field);
    return function(req, res, next) {
        if(getField(req, field).length < len) {
            next();
        } else {
            res.error(field + ' 입력 길이가 ' + len + '자 미만이어야 합니다.');
            res.redirect('back');
        }
    }
}