// express 모듈 불러오기
const express = require('express');
// socket.io 모듈 불러오기
const socket = require('socket.io');
// Node.js 기본 내장 모듈 불러오기
const http = require('http');
// Node.js 기본 내장 모듈 불러오기
const fs = require('fs');
// express 객체 생성
const app = express();
// express http 서버 생성
const server = http.createServer(app);
// 생성한 서버를 socket.io에 바인딩
const io = socket(server);

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

// GET 방식으로 / 경로에 접속하면 실행 가능
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

    // 새로운 유저가 접속시 다른 유저에게 알려줌
    socket.on('newUser', function(name){
        console.log(name + '님이 접속했습니다!');

        // 소켓에 이름 저장해두기
        socket.name = name;

        // 모든 소켓에게 전송
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속했습니다!'})
    });

    // 전송한 메세지 받기
    socket.on('message', function(data){
        // 받은 데이터에 누가 보냈는지 이름 추가
        data.name = socket.name

        console.log(data)

        // 보낸 사람 제외 나머지에게 보내기
        socket.broadcast.emit('update', data)
    })

    // 접속 종료
    socket.on('disconnect', function(){
        console.log(socket.name + '님이 나가셨습니다!');

        // 나가는 사람을 제외한 나머지 유저들에게 메세지 전송하기
        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나갔습니다!'})
    })

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