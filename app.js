var express = require('express'),
    http = require('http'),
    path =require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static'),
    expressErrorHandler = require('express-error-handler'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'); 

// 사용자 정의 모듈
var index = require('./routes/index');
var signup = require('./routes/signup');
var signin = require('./routes/signin');
var entries = require('./routes/entries');



// 사용자 정의 미들웨어
var user = require('./lib/middleware/user');
var messages = require('./lib/middleware/messages');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var Entry  = require('./lib/entry');

var app = express();
app.set('port', process.PORT || 3000);
app.set('views' , __dirname+'/views');
app.set('view engine', 'ejs');


app.use(favicon(path.join(__dirname, 'public','images/favicon.ico')));
app.use(static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended : false
}));
app.use(bodyParser.json());
app.use(expressSession({
    secret : 'mykey',
    resave : true,
    saveUninitialized : true
}));
app.use(cookieParser());

app.use(user);
app.use(messages);

var router = express.Router();

/********************** Router ***************************/
router.route('/').get(index.main);
router.route('/signup').get(signup.form);
router.route('/signup').post(signup.submit);
router.route('/signin').get(signin.form);
router.route('/signin').post(
    validate.required('name'),
    validate.required('pw'),
    signin.submit
);
router.route('/post').get(entries.form);
router.route('/post').post(
    validate.required('title'),
    validate.lengthAbove('title', 2),
    validate.lengthLimit('title', 10),
    validate.required('body'),
    validate.lengthLimit('body', 80),
    entries.submit
);

// router.route('/postList').post(entries.submit);
router.route('/postList/:page?').get(
    page(Entry.count, 3),
    entries.list
);
/********************** Router ***************************/

app.use('/',router);


http.createServer(app).listen(app.get('port'), function(){
    console.log('server listening on port ' + app.get('port'));
});