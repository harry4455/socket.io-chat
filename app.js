// express 모듈 불러오기
const express = require('express');
// socket.io 모듈 불러오기
const socket = require('socket.io');
// Node.js 기본 내장 모듈 불러오기
const http = require('http');
const fs = require('fs');
// express 객체 생성
const app = express();
// express http 서버 생성
const server = http.createServer(app);
// 생성한 서버를 socket.io에 바인딩
const io = socket(server);

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

// GET 방식으로 경로에 접속하면 실행 가능
app.get('/', function(request, response){
    fs.readFile('./static/index.html', function(err, data) {
        if(err) {
            response.send('error');
        } else {
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
});

io.sockets.on('connection', function(socket) {
    console.log('유저가 접속 되었다!');

    socket.on('send', function(data){
        console.log('전달된 메세지 : ', data.msg)
    })

    socket.on('disconnect', function() {
        console.log('접속이 종료되었다!');
    })
})

// 서버를 port 8080으로 listen
server.listen(8080, function() {
    console.log('Server Running......');
    
});