var socket = io()

// 접속이 되었을 때 실행
socket.on('connect', function() {
    var input = document.getElementById('test')
    input.value = '접속 됨';
})

// 전송하는 함수
function send(){
    //입력되어 있는 데이터 가져오기
    var message = document.getElementById('test').value

    // 가져왔으니 데이터 빈칸으로 변경
    document.getElementById('test').value = ''

    // 서버로 send 이벤트 전달, 데이터도 같이 보냄
    socket.emit('send', {msg: message})
}