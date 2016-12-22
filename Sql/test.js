// 모듈을 추출합니다.
var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var mysql = require('mysql');
var express = require('express');
// url request
var url = require('url');

// 데이터베이스와 연결합니다.
var client = mysql.createConnection({
    user: 'root',
    password: '0000',
    database: 'DrToilet'
});

// 서버를 생성합니다.
var app = express();

app.use(express.bodyParser());
app.use(app.router);

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " SOME_PARAM");
    process.exit(-1);
}

var port = process.argv[2];

// 서버를 실행합니다.
http.createServer(app).listen(port, function (request,response) {
    console.log('============== DrToilet Server Running ===============');
});


app.get('/', function (request, response) {
    // 파일을 읽습니다.
    fs.readFile('list.html', 'utf8', function (error, data) {
        // 데이터베이스 쿼리를 실행합니다.
        client.query('SELECT * FROM DrToilet', function (error, results) {
            // 응답합니다.
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/insert', function (request, response) {
    // 파일을 읽습니다.
    fs.readFile('insert.html', 'utf8', function (error, data) {
        // 응답합니다.
        response.send(data);
    });
});

app.post('/insert', function (request, response) {
    // 변수를 선언합니다.
    //console.log(request);

    var user = request.body.user;
    var weight = request.body.weight;
    var date = request.body.date;
    var type = request.body.type;

    // 데이터베이스 쿼리를 실행합니다.
    client.query('INSERT INTO DrToilet (user, weight, date, type) VALUES (?, ?, ?, ?, ?)', 
    [user,weight,date,type],
    function () {
        // 응답합니다.
        response.redirect('/');
    });
});

app.get('/insert2', function (request, response) {
    // 변수를 선언합니다.
    var fuser = request.param('user');
    var fweight = request.param('weight');
    var fdate = request.param('date');
    var ftype = request.param('type');
    var fage = request.param('age'); 

    // 데이터베이스 쿼리를 실행합니다.
    fs.readFile('list.html', 'utf8', function (error, data) {
        client.query('INSERT INTO DrToilet (user, weight, date, type, age) VALUES (?, ?, ?, ?, ?)', 
        [fuser,fweight,fdate,ftype,fage],
        function () {
            // 응답합니다.
            console.log(fuser+" Client send "+fweight+" data and "+ftype+" data and "+fage+" data at "+fdate);
            response.redirect('/');
        });
    });
});

app.get('/requestData',function (request,response) {
    console.log("Client request User's Data");
    var Duser = request.param('user');
    fs.readFile('list.html', 'utf8', function (error, data) {
        client.query('SELECT user, weight, date, type FROM DrToilet WHERE user = ? ORDER BY DATE ASC',
            [Duser],
            function (error,results) {
            response.send(results);
        });
    });
});

app.get('/sort',function(request,response) {

    fs.readFile('list.html', 'utf8', function (error, data) {
        client.query('SELECT * FROM DrToilet ORDER BY USER ASC,DATE ASC',function(error,results) {
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/origin',function(request,response) {

    fs.readFile('list.html','utf8',function(error,data){
        client.query('SELECT * FROM DrToilet',function(error,results){
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});